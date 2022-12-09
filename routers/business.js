const express = require('express');
const router = express.Router();

const { getAllBusiness, createBusiness, updateBusiness, deleteBusiness } = require('../controllers/business');

router.get('/search', getAllBusiness)
router.post('/', createBusiness)
router.put('/', updateBusiness)
router.delete('/:id', deleteBusiness)

module.exports = router;