import React, { useState } from 'react';
import { ExpenseItem } from '../../types/notion';
import { Plus, Trash2, DollarSign, PieChart, ShieldCheck, ShoppingBag } from 'lucide-react';

interface ExpenseTableBlockProps {
  expenses: ExpenseItem[];
  onChange: (updated: ExpenseItem[]) => void;
  isDark: boolean;
}

const CATEGORIES: ExpenseItem['category'][] = [
  'Housing',
  'Food & Groceries',
  'Transportation',
  'Health & Fitness',
  'Entertainment',
  'Shopping',
  'Savings/Invest',
  'Other',
];

const PAYMENT_METHODS: ExpenseItem['paymentMethod'][] = [
  'Credit Card',
  'Debit Card',
  'Cash',
  'Bank Transfer',
];

export const ExpenseTableBlock: React.FC<ExpenseTableBlockProps> = ({
  expenses = [],
  onChange,
  isDark,
}) => {
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseItem['category']>('Food & Groceries');
  const [newPayment, setNewPayment] = useState<ExpenseItem['paymentMethod']>('Debit Card');
  const [newIsEssential, setNewIsEssential] = useState(true);

  const totalSpent = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const essentialTotal = expenses
    .filter(i => i.isEssential)
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const discretionaryTotal = totalSpent - essentialTotal;

  const handleAdd = () => {
    if (!newDesc.trim() || !newAmount) return;
    const item: ExpenseItem = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      description: newDesc.trim(),
      amount: parseFloat(newAmount) || 0,
      category: newCategory,
      paymentMethod: newPayment,
      isEssential: newIsEssential,
    };
    onChange([...expenses, item]);
    setNewDesc('');
    setNewAmount('');
  };

  const handleDelete = (id: string) => {
    onChange(expenses.filter(e => e.id !== id));
  };

  const handleUpdate = (id: string, field: keyof ExpenseItem, value: any) => {
    const updated = expenses.map(e => {
      if (e.id === id) {
        return { ...e, [field]: value };
      }
      return e;
    });
    onChange(updated);
  };

  return (
    <div className={`my-4 rounded-xl border overflow-hidden ${
      isDark ? 'bg-stone-900/40 border-stone-800' : 'bg-stone-50/80 border-stone-200'
    }`}>
      {/* Table Header Summary Strip */}
      <div className={`px-4 py-3 flex items-center justify-between border-b text-xs ${
        isDark ? 'border-stone-800 bg-stone-900/80' : 'border-stone-200 bg-stone-100/70'
      }`}>
        <div className="flex items-center gap-2 font-semibold">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>Financial Outflow Tracker</span>
        </div>
        <div className="flex items-center gap-4 font-mono tabular-nums">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Needs: ${essentialTotal.toFixed(2)}
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <ShoppingBag className="w-3.5 h-3.5" /> Wants: ${discretionaryTotal.toFixed(2)}
          </span>
          <span className="font-bold text-white pl-2 border-l border-stone-700">
            Total: ${totalSpent.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Database Table Rows */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className={`border-b ${isDark ? 'border-stone-800 text-stone-400' : 'border-stone-200 text-stone-500'}`}>
              <th className="py-2.5 px-3 font-medium">Expense Item</th>
              <th className="py-2.5 px-3 font-medium w-28">Amount ($)</th>
              <th className="py-2.5 px-3 font-medium w-36">Category</th>
              <th className="py-2.5 px-3 font-medium w-32">Payment</th>
              <th className="py-2.5 px-3 font-medium w-24">Essential?</th>
              <th className="py-2.5 px-2 w-10"></th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-stone-800/60' : 'divide-stone-200/60'}`}>
            {expenses.map(item => (
              <tr key={item.id} className={`group transition-colors ${
                isDark ? 'hover:bg-stone-800/30' : 'hover:bg-stone-100/50'
              }`}>
                {/* Description */}
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={item.description}
                    onChange={e => handleUpdate(item.id, 'description', e.target.value)}
                    className="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-amber-300 rounded px-1 text-xs"
                  />
                </td>

                {/* Amount */}
                <td className="py-2 px-3 font-mono tabular-nums">
                  <div className="flex items-center">
                    <span className="text-stone-500 mr-1">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={item.amount}
                      onChange={e => handleUpdate(item.id, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-amber-300 rounded px-1 text-xs font-mono"
                    />
                  </div>
                </td>

                {/* Category */}
                <td className="py-2 px-3">
                  <select
                    value={item.category}
                    onChange={e => handleUpdate(item.id, 'category', e.target.value)}
                    className={`w-full bg-transparent focus:outline-none text-xs rounded py-0.5 cursor-pointer ${
                      isDark ? 'text-stone-300' : 'text-stone-700'
                    }`}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Payment Method */}
                <td className="py-2 px-3">
                  <select
                    value={item.paymentMethod}
                    onChange={e => handleUpdate(item.id, 'paymentMethod', e.target.value)}
                    className={`w-full bg-transparent focus:outline-none text-xs rounded py-0.5 cursor-pointer ${
                      isDark ? 'text-stone-300' : 'text-stone-700'
                    }`}
                  >
                    {PAYMENT_METHODS.map(pm => (
                      <option key={pm} value={pm} className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>
                        {pm}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Essential Toggle */}
                <td className="py-2 px-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.isEssential}
                      onChange={e => handleUpdate(item.id, 'isEssential', e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span className={`text-[11px] ${item.isEssential ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {item.isEssential ? 'Essential' : 'Discretionary'}
                    </span>
                  </label>
                </td>

                {/* Delete action */}
                <td className="py-2 px-2 text-right">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-stone-500 hover:text-rose-400 transition-opacity rounded cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}

            {/* Quick Add Row */}
            <tr className={`border-t ${isDark ? 'border-stone-800/80 bg-stone-950/20' : 'border-stone-200/80 bg-white/40'}`}>
              <td className="py-2 px-3">
                <input
                  type="text"
                  placeholder="+ Add new expense..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  className="w-full bg-transparent focus:outline-none text-xs placeholder-stone-500"
                />
              </td>
              <td className="py-2 px-3">
                <div className="flex items-center">
                  <span className="text-stone-500 mr-1">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    className="w-full bg-transparent focus:outline-none text-xs font-mono"
                  />
                </div>
              </td>
              <td className="py-2 px-3">
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className={`w-full bg-transparent focus:outline-none text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>
                      {cat}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-2 px-3">
                <select
                  value={newPayment}
                  onChange={e => setNewPayment(e.target.value as any)}
                  className={`w-full bg-transparent focus:outline-none text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}
                >
                  {PAYMENT_METHODS.map(pm => (
                    <option key={pm} value={pm} className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>
                      {pm}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-2 px-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsEssential}
                    onChange={e => setNewIsEssential(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span className="text-[11px] text-stone-400">Essential</span>
                </label>
              </td>
              <td className="py-2 px-2 text-right">
                <button
                  onClick={handleAdd}
                  disabled={!newDesc.trim() || !newAmount}
                  className="p-1 rounded bg-amber-300 text-stone-950 hover:bg-amber-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Add row"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
