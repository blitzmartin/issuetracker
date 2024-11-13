'use strict';
const { Issue, Project } = require('../models/models');
const QueryParser = require('mongoose-query-parser').MongooseQueryParser;
const queryParser = new QueryParser()

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async (req, res) => {
      const projectName = req.params.project;

      try {
        const project = await Project.findOne({ name: projectName })

        if (!project) {
          return res.status(404).json({ error: "Project not found" });
        }
        const filter = { projectId: project._id };
        const parsedQuery = queryParser.parse(req.query);
        Object.assign(filter, parsedQuery.filter)

        const issues = await Issue.find(filter).select({ project: 0, __v: 0 });
        res.json(issues);
      } catch (error) {
        console.error("Error retrieving issues:\n", error);
        res.status(500).json({ error: "Failed to retrieve issues" });
      }
    })

    .post(async (req, res) => {
      let projectName = req.params.project
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: "required field(s) missing" });
      }

      try {
        let project = await Project.findOne({ name: projectName })
        if (!project) {
          project = new Project({ name: projectName })
          project = await project.save()
        }
        const issue = new Issue({
          projectId: project._id,
          issue_title,
          issue_text,
          created_by,
          assigned_to: assigned_to || '',
          status_text: status_text || '',
          created_on: new Date(),
          updated_on: new Date(),
          open: true
        })

        const savedIssue = await issue.save();
        res.status(201).json(savedIssue);
      } catch (err) {
        console.log("There was an error while creating issue: ", err)
      }
    })

    .put(async (req, res) => {
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
      try {
        if (!_id) {
          return res.json({ error: 'missing _id' });
        }
        const issue = await Issue.findById(_id);
        if (!issue) {
          return res.json({ error: 'could not update', '_id': _id });
        }

        // Prepare the update object
        const update = {
          updated_on: new Date()
        };
        if (issue_title) update.issue_title = issue_title;
        if (issue_text) update.issue_text = issue_text;
        if (created_by) update.created_by = created_by;
        if (assigned_to) update.assigned_to = assigned_to;
        if (status_text) update.status_text = status_text;
        if (open !== undefined) update.open = open;

        // Check if there's anything to update
        if (Object.keys(update).length === 0) {
          return res.json({ error: 'no update field(s) sent', '_id': _id });
        }

        const updatedIssue = await Issue.findByIdAndUpdate(_id, { $set: update }, { new: true });
        res.json({ result: 'successfully updated', '_id': _id });
      } catch (err) {
        console.log("There was an error while creating issue: ", err)
      }

    })

    .delete(function (req, res) {
      let project = req.params.project;

    });

};
