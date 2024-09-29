const mongose = require('mongoose');

const userSchema = new mongose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret, options) {
        const { _id: id } = ret;

        delete ret._id;
        delete ret.__v;
        delete ret.password;

        return { id, ...ret };
      },
    },
  }
);

const User = mongose.model('User', userSchema);

module.exports = User;
