const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const groupSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
groupSchema.plugin(toJSON);
groupSchema.plugin(paginate);

/**
 * @typedef User
 */
const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
