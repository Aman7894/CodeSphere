import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';

const TIMEOUT_MS = 10000; // 10 seconds

const LANGUAGE_CONFIG = {
    python: {
        extension: '.py',
        compile: null,
        run: (filePath) => ['python', [filePath]],
    },
    java: {
        extension: '.java',
        // Java file must be named after the public class — we use "Main.java"
        fileName: 'Main.java',
        compile: (filePath, dir) => ['javac', [filePath], dir],
        run: (filePath, dir) => ['java', ['-cp', dir, 'Main']],
    },
    cpp: {
        extension: '.cpp',
        compile: (filePath, dir) => {
            const outPath = path.join(dir, 'output.exe');
            return ['g++', [filePath, '-o', outPath], dir];
        },
        run: (filePath, dir) => [path.join(dir, 'output.exe'), []],
    },
    c: {
        extension: '.c',
        compile: (filePath, dir) => {
            const outPath = path.join(dir, 'output.exe');
            return ['gcc', [filePath, '-o', outPath], dir];
        },
        run: (filePath, dir) => [path.join(dir, 'output.exe'), []],
    },
};

/**
 * Executes a command as a child process and returns the result.
 */
function executeProcess(command, args, options = {}) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        let stdout = '';
        let stderr = '';
        let killed = false;

        const proc = spawn(command, args, {
            timeout: TIMEOUT_MS,
            ...options,
        });

        proc.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        proc.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        // Write stdin if provided
        if (options.stdin) {
            proc.stdin.write(options.stdin);
            proc.stdin.end();
        } else {
            proc.stdin.end();
        }

        proc.on('error', (err) => {
            resolve({
                stdout,
                stderr: err.message,
                exitCode: 1,
                executionTime: Date.now() - startTime,
            });
        });

        proc.on('close', (code, signal) => {
            if (signal === 'SIGTERM') {
                killed = true;
            }
            resolve({
                stdout,
                stderr: killed ? stderr + '\n⏰ Execution timed out (10s limit)' : stderr,
                exitCode: code,
                executionTime: Date.now() - startTime,
                timedOut: killed,
            });
        });
    });
}

/**
 * POST /api/code/execute
 * Body: { code, language, stdin }
 */
export const executeCode = async (req, res) => {
    const { code, language, stdin } = req.body;

    if (!code || !language) {
        return res.status(400).json({
            success: false,
            message: 'Code and language are required.',
        });
    }

    const config = LANGUAGE_CONFIG[language];
    if (!config) {
        return res.status(400).json({
            success: false,
            message: `Unsupported language: ${language}. Supported: ${Object.keys(LANGUAGE_CONFIG).join(', ')}`,
        });
    }

    // Create a temporary directory for this execution
    const tempDir = path.join(os.tmpdir(), `code-exec-${randomUUID()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    const fileName = config.fileName || `main${config.extension}`;
    const filePath = path.join(tempDir, fileName);

    try {
        // Write source code to temp file
        fs.writeFileSync(filePath, code, 'utf-8');

        // Compile step (if needed)
        if (config.compile) {
            const [cmd, args, cwd] = config.compile(filePath, tempDir);
            const compileResult = await executeProcess(cmd, args, { cwd: cwd || tempDir });

            if (compileResult.exitCode !== 0) {
                return res.json({
                    success: true,
                    output: '',
                    error: compileResult.stderr || 'Compilation failed.',
                    executionTime: compileResult.executionTime,
                    phase: 'compilation',
                });
            }
        }

        // Run step
        const [cmd, args] = config.run(filePath, tempDir);
        const runResult = await executeProcess(cmd, args, {
            cwd: tempDir,
            stdin: stdin || '',
        });

        return res.json({
            success: true,
            output: runResult.stdout,
            error: runResult.stderr,
            executionTime: runResult.executionTime,
            exitCode: runResult.exitCode,
            timedOut: runResult.timedOut || false,
            phase: 'execution',
        });
    } catch (err) {
        console.error('Code execution error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during code execution.',
            error: err.message,
        });
    } finally {
        // Clean up temp directory
        try {
            fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (e) {
            // Ignore cleanup errors
        }
    }
};
