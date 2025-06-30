const express = require('express');
const router = express.Router();
const DataCollectionController = require('../../controllers/admin/dataCollectionController');
const { dataCollectionValidation, validate } = require('../../middleware/dataCollectionValidation');
const { authenticateToken } = require('../../middleware/auth');

// Public form routes (no authentication required)
router.get(
    '/forms/:token/validate',
    DataCollectionController.validateToken
);

router.get(
    '/forms/:token/structure',
    DataCollectionController.getFormStructure
);

router.post(
    '/forms/:token/submit',
    validate(dataCollectionValidation.submitResponses),
    DataCollectionController.submitResponses
);

module.exports = router;
