import express from 'express'
const router = express.Router()
import {
    createUrl,
    getUrl,
    getUserUrls,
    deleteUrl,
} from '../controllers/urlController.js'
import { protect } from '../middleware/authMiddleware.js'

router.route('/')
    .post(protect, createUrl)
    .get(protect, getUserUrls)

router
    .route('/:id')
    .get(protect, getUrl)
    .delete(protect, deleteUrl)

export default router
