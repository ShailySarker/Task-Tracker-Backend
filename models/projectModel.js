const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
  },
  { timestamps: true }
);

// Limit projects to 4 per user
projectSchema.pre('save', async function (next) {
  const userProjects = await this.model('Project').countDocuments({
    user: this.user,
  });

  if (userProjects >= 4) {
    throw new Error('User can have maximum 4 projects');
  }

  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;