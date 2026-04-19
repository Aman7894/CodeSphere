import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { MonacoBinding } from 'y-monaco';

const MONACO_LANGUAGE_MAP = {
    python: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
};

const DEFAULT_CODE = {
    python: '# Write your Python code here\nprint("Hello, World!")\n',
    java: '// Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n',
    cpp: '// Write your C++ code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n',
    c: '// Write your C code here\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n',
};

const Editor = forwardRef(({ ydoc, awareness, language = 'python' }, ref) => {
    const editorRef = useRef(null);

    // Update boilerplate when language changes, if the current code is empty or is another boilerplate
    useEffect(() => {
        if (editorRef.current) {
            const currentCode = editorRef.current.getValue();
            const isBoilerplate = Object.values(DEFAULT_CODE).some(code => code === currentCode) || currentCode.trim() === '';
            
            if (isBoilerplate) {
                editorRef.current.setValue(DEFAULT_CODE[language] || '');
            }
        }
    }, [language]);

    // Expose getCode() to parent via ref
    useImperativeHandle(ref, () => ({
        getCode: () => {
            if (editorRef.current) {
                return editorRef.current.getValue();
            }
            return '';
        },
        setCode: (code) => {
            if (editorRef.current) {
                editorRef.current.setValue(code);
            }
        },
    }));

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        if (ydoc && awareness) {
            // Get the shared text type from Yjs
            const yText = ydoc.getText('monaco');

            // Bind Yjs text to Monaco Editor
            const binding = new MonacoBinding(
                yText, 
                editor.getModel(), 
                new Set([editor]), 
                awareness
            );
            
            console.log('Monaco Binding initialized');
        }
    };

    return (
        <div className="h-full w-full overflow-hidden rounded-xl border border-gray-800 bg-[#1e1e1e] shadow-2xl">
            <MonacoEditor
                height="100%"
                theme="vs-dark"
                language={MONACO_LANGUAGE_MAP[language] || 'python'}
                defaultValue={DEFAULT_CODE[language] || '// Start coding...'}
                onMount={handleEditorDidMount}
                options={{
                    fontSize: 15,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16 },
                    fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                    fontLigatures: true,
                    cursorSmoothCaretAnimation: "on",
                    smoothScrolling: true,
                    lineNumbers: 'on',
                    renderLineHighlight: 'all',
                    bracketPairColorization: { enabled: true },
                    guides: { bracketPairs: true },
                }}
            />
        </div>
    );
});

Editor.displayName = 'Editor';

export default Editor;
