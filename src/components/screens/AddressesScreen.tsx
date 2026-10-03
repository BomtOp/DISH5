import React, { useState } from 'react';
import { ScreenId, Address } from '../../types';
import { SAVED_ADDRESSES } from '../../data/mockData';

interface AddressesScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const AddressesScreen: React.FC<AddressesScreenProps> = ({ onNavigate: _onNavigate }) => {
  const [addresses, setAddresses] = useState<Address[]>(SAVED_ADDRESSES);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Sector Hub'>('Home');
  const [newLine1, setNewLine1] = useState('');
  const [newSector, setNewSector] = useState('Hitec City • Sector 04');
  const [newNotes, setNewNotes] = useState('');

  const hyderabadSectors = [
    'Hitec City • Sector 04',
    'Charminar • Heritage',
    'Gachibowli • Sector 02',
    'Jubilee Hills • Road 36',
    'Secunderabad • Clock Tower'
  ];

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const handleAddAddress = () => {
    if (!newLine1.trim()) return;
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      line1: newLine1,
      sector: newSector,
      city: 'Hyderabad 500081',
      isDefault: addresses.length === 0,
      notes: newNotes
    };
    setAddresses((prev) => [...prev, newAddr]);
    setNewLine1('');
    setNewNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen pb-24 pt-20 px-4 max-w-[480px] mx-auto w-full space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#F5F8FF] font-space">DELIVERY DESTINATIONS</h2>
          <p className="text-xs text-[#869396]">Verified Hyderabad dispatch drop zones</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1.5 rounded-xl bg-[#63e6ff] text-black font-space font-bold text-xs cursor-pointer hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">
            {showAddForm ? 'close' : 'add'}
          </span>
          {showAddForm ? 'CANCEL' : 'ADD NEW'}
        </button>
      </div>

      {showAddForm && (
        <div className="p-4 rounded-2xl bg-[#10182A] border border-[#63e6ff]/30 space-y-3">
          <span className="text-xs font-bold text-[#63e6ff] font-space uppercase">
            REGISTER NEW DROP POD
          </span>

          <div className="flex gap-2">
            {(['Home', 'Work', 'Sector Hub'] as const).map((lbl) => (
              <button
                key={lbl}
                onClick={() => setNewLabel(lbl)}
                className={`px-3 py-1 rounded-lg text-xs font-space font-bold border cursor-pointer ${
                  newLabel === lbl
                    ? 'bg-[#63e6ff] text-black border-[#63e6ff]'
                    : 'bg-[#060914] text-[#869396] border-white/10'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-space text-[#869396] uppercase">Select Hyderabad Zone</span>
            <div className="grid grid-cols-2 gap-1.5">
              {hyderabadSectors.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setNewSector(sec)}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-space font-semibold text-left border cursor-pointer truncate ${
                    newSector === sec
                      ? 'bg-[#63e6ff]/20 text-[#63e6ff] border-[#63e6ff]'
                      : 'bg-[#060914] text-[#869396] border-white/10'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder="Address Line / Sky Tower / Apartment"
            value={newLine1}
            onChange={(e) => setNewLine1(e.target.value)}
            className="w-full bg-[#060914] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5F8FF] focus:outline-none focus:border-[#63e6ff]"
          />

          <input
            type="text"
            placeholder="Security Gate / Smart Lock Note (Optional)"
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            className="w-full bg-[#060914] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5F8FF] focus:outline-none focus:border-[#63e6ff]"
          />

          <button
            onClick={handleAddAddress}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ba027b] to-[#63e6ff] text-black font-space font-bold text-xs uppercase cursor-pointer"
          >
            CONFIRM HYDERABAD DESTINATION
          </button>
        </div>
      )}

      {/* Address Cards */}
      <div className="space-y-3">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-4 rounded-2xl bg-[#10182A]/80 border transition-all ${
              addr.isDefault ? 'border-[#63e6ff]/40 shadow-lg' : 'border-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#63e6ff]">
                  {addr.label === 'Home' ? 'home' : addr.label === 'Work' ? 'business' : 'place'}
                </span>
                <span className="text-xs font-bold text-[#F5F8FF] font-space uppercase">
                  {addr.label}
                </span>
                {addr.isDefault && (
                  <span className="text-[9px] font-space font-bold px-1.5 py-0.5 rounded bg-[#63e6ff]/20 text-[#63e6ff]">
                    DEFAULT
                  </span>
                )}
              </div>
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-[10px] text-[#869396] hover:text-[#63e6ff] font-space cursor-pointer"
                >
                  SET AS DEFAULT
                </button>
              )}
            </div>

            <p className="text-xs text-[#F5F8FF] font-medium">{addr.line1}</p>
            <p className="text-[11px] text-[#869396] font-space mt-0.5">
              {addr.sector}, {addr.city}
            </p>
            {addr.notes && (
              <p className="text-[10px] text-[#ffd86b] mt-1.5 bg-[#060914] px-2 py-1 rounded border border-white/5">
                Note: {addr.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
