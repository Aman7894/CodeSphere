import express from 'express';
import {
    listProblemset,
    listContests,
    getContestProblems,
    getProblemMeta,
    problemUrl
} from '../services/codeforcesService.js';

const router = express.Router();

router.get('/problemset', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const pageSize = Math.min(100, Math.max(10, parseInt(req.query.pageSize, 10) || 50));
        const query = req.query.q || req.query.query || '';
        const tag = req.query.tag || '';

        const data = await listProblemset({ page, pageSize, query, tag });
        res.json({ success: true, ...data });
    } catch (e) {
        console.error('[CF] problemset', e);
        res.status(500).json({
            success: false,
            message: e.message || 'Failed to load Codeforces problemset'
        });
    }
});

router.get('/contests', async (req, res) => {
    try {
        const gym = req.query.gym === 'true' || req.query.gym === '1';
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const pageSize = Math.min(50, Math.max(10, parseInt(req.query.pageSize, 10) || 30));

        const data = await listContests({ gym, page, pageSize });
        res.json({ success: true, ...data });
    } catch (e) {
        console.error('[CF] contests', e);
        res.status(500).json({
            success: false,
            message: e.message || 'Failed to load contests'
        });
    }
});

router.get('/contest/:contestId/problems', async (req, res) => {
    try {
        const data = await getContestProblems(req.params.contestId);
        res.json({ success: true, ...data });
    } catch (e) {
        console.error('[CF] contest problems', e);
        const status = e.code === 'BAD_REQUEST' ? 400 : 500;
        res.status(status).json({
            success: false,
            message: e.message || 'Failed to load contest problems'
        });
    }
});

router.get('/problem/:contestId/:index', async (req, res) => {
    try {
        const meta = await getProblemMeta(req.params.contestId, req.params.index);
        if (!meta) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found.'
            });
        }
        res.json({
            success: true,
            problem: meta,
            url: problemUrl(meta.contestId, meta.index)
        });
    } catch (e) {
        console.error('[CF] problem meta', e);
        res.status(500).json({
            success: false,
            message: e.message || 'Failed to load problem'
        });
    }
});

export default router;
