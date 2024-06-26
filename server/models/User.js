import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.password;
    return ret;
  },
});

UserSchema.set('toObject', {
  transform: (doc, ret, options) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model('User', UserSchema);
export default User;
