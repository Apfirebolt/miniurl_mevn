import express from 'express'
const router = express.Router()
import {
    createUrl,
    getUrl,
    getUserUrls,
    deleteUrl,
    updateUrl
} from '../controllers/urlController.js'
import { protect } from '../middleware/authMiddleware.js'

router.route('/')
    .post(protect, createUrl)
    .get(protect, getUserUrls)

router
    .route('/:id')
    .get(protect, getUrl)
    .patch(protect, updateUrl)
    .delete(protect, deleteUrl)

export default router
