import express from "express"
const router = express.Router();
import lstmAnalysisController from '../controller/lstmAnalysis.js'


router.post('/analysis',lstmAnalysisController.analyzeLSTM);

router.get('/analysis',lstmAnalysisController.getAnalysis);

export default router;
