'use strict';
const { Issue, Project } = require('../models/models');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async (req, res) => {
      const projectName = req.params.project;
      //let filter = { project };
      /*   if (Object.keys(req.query).length > 0) {
          filter = { ...filter, ...req.query };
        } */

      try {
        const project = await Project.findOne({ name: projectName })
        const issues = await Issue.find({ projectId: project._id }).select({ project: 0, __v: 0 });
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

    .put(function (req, res) {
      let project = req.params.project;

    })

    .delete(function (req, res) {
      let project = req.params.project;

    });

};
