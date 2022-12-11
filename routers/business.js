const express = require('express');
const router = express.Router();

const { getAllBusiness, getBusinessDetails, createBusiness, updateBusiness, deleteBusiness } = require('../controllers/business');

router.get('/search', getAllBusiness)
router.get('/:id', getBusinessDetails)
router.post('/', createBusiness)
router.put('/', updateBusiness)
router.delete('/:id', deleteBusiness)

module.exports = router;