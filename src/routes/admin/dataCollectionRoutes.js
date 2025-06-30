const express = require('express');
const router = express.Router();
const DataCollectionController = require('../../controllers/admin/dataCollectionController');
const { dataCollectionValidation, validate } = require('../../middleware/dataCollectionValidation');
const { authenticateToken } = require('../../middleware/auth');

// Protected admin routes
router.get(
    '/forms',
    authenticateToken,
    DataCollectionController.getAllForms
);

router.get(
    '/responses',
    authenticateToken,
    DataCollectionController.getAllResponses
);

router.put(
    '/responses/:id',
    authenticateToken,
    validate(dataCollectionValidation.editResponse),
    DataCollectionController.editResponse
);

router.post(
    '/forms/generate',
    authenticateToken,
    validate(dataCollectionValidation.generateLink),
    DataCollectionController.generateLink
);

router.post(
    '/responses/:id/comment',
    authenticateToken,
    validate(dataCollectionValidation.addComment),
    DataCollectionController.addComment
);

router.delete(
    '/responses/:id',
    authenticateToken,
    DataCollectionController.deleteForm
);

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
