const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
     projectId: { type: String, required: true },
     issue_title: { type: String, required: true },
     issue_text: { type: String, required: true },
     created_by: { type: String, required: true },
     assigned_to: { type: String, default: '' },
     status_text: { type: String, default: '' },
     created_on: { type: Date, default: Date.now },
     updated_on: { type: Date, default: Date.now },
     open: { type: Boolean, default: true },
});

const projectSchema = new mongoose.Schema({
     name: { type: String, required: true }
})

const Issue = mongoose.model('Issue', issueSchema);
const Project = mongoose.model('Project', projectSchema);

module.exports = { Issue, Project };
