const mongoose = require('mongoose');

class Service {
    async create(model, data) {
        try {
            return await model.create(data);
        } catch (e) {
            throw new Error(`Error creating document: ${e.message}`);
        }
    }

    async getOne(model, id) {
        try {
            this.checkId(id);
            return await model.findById(id);
        } catch (e) {
            throw new Error(`Error getting document: ${e.message}`);
        }
    }

    async getByField(model, field, value) {
        try {
            return await model.findOne({ [field]: value });
        } catch (e) {
            throw new Error(`Error fetching document by field: ${e.message}`);
        }
    }

    async get(model) {
        try {
            return await model.find();
        } catch (e) {
            throw new Error('Error getting documents');
        }
    }

    async update(model, id, data) {
        try {
            this.checkId(id);
            const updatedDocument = await model.findByIdAndUpdate(id, data, { new: true });
            if (!updatedDocument) throw new Error(`Document not found for update: ${id}`);
            return updatedDocument;
        } catch (e) {
            throw new Error(`Error updating document: ${e.message}`);
        }
    }

    async delete(model, id) {
        try {
            this.checkId(id);
            const deletedDocument = await model.findByIdAndDelete(id);
            if (!deletedDocument) throw new Error(`Document not found for deletion: ${id}`);
            return deletedDocument;
        } catch (e) {
            throw new Error(`Error deleting document: ${e.message}`);
        }
    }

    checkId(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
        }
    }
}

module.exports = Service;
