import mongoose from 'mongoose';
import { loadType } from 'mongoose-currency';
const Schema = mongoose.Schema;
loadType(mongoose);
export const monthSchema = new Schema(
  {
    month: String,
    revenue: {
      type: mongoose.Types.Currency,
      currency: 'PHP',
      get: (v) => v / 100,
    },
    expenses: {
      type: mongoose.Types.Currency,
      currency: 'PHP',
      get: (v) => v / 100,
    },
    operationalExpenses: {
      type: mongoose.Types.Currency,
      currency: 'PHP',
      get: (v) => v / 100,
    },
    nonOperationalExpenses: {
      type: mongoose.Types.Currency,
      currency: 'PHP',
      get: (v) => v / 100,
    },
  },
  { toJSON: { getters: true } }
);

const Month = mongoose.model('Month', monthSchema);

export default Month;
