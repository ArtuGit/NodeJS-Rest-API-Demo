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
    private: {
      type: Boolean,
      required: true,
    },
    image: {
      type: String,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

groupSchema.methods.addUser = function (user) {
  const userId = user._id;
  if (!this.members.includes(userId)) {
    this.members.push(userId);
    return this.save();
  }
  return this;
};

groupSchema.methods.deleteUser = function (user) {
  const userId = user._id;
  const index = this.members.findIndex((item) => item.toHexString() === userId.toHexString());
  if (index !== -1) {
    this.members.splice(index, 1);
    return this.save();
  }
  return this;
};

// add plugin that converts mongoose to json
groupSchema.plugin(toJSON);
groupSchema.plugin(paginate);

/**
 * @typedef User
 */
const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
