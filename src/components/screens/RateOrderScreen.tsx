import React, { useState } from 'react';
import { OrderReviewFeedback } from '../../types';

interface RateOrderScreenProps {
  onSubmitReview: (feedback: OrderReviewFeedback) => void;
  onBackToHome: () => void;
}

export const RateOrderScreen: React.FC<RateOrderScreenProps> = ({
  onSubmitReview,
  onBackToHome
}) => {
  const [activeTab, setActiveTab] = useState<'receipt' | 'rating'>('rating');
  const [foodRating, setFoodRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Dum Integrity',
    'Steaming Hot'
  ]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isReceiptSaved, setIsReceiptSaved] = useState(false);

  const availableTags = [
    'Dum Integrity',
    'Steaming Hot',
    'Perfect Salan Ratio',
    'Fast Cable Transit',
    'Flawless Packaging',
    'Authentic Masala'
  ];

  const handleToggleTag = (t: string) => {
    setSelectedTags((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const handleSubmit = () => {
    onSubmitReview({
      orderId: 'DS-8821',
      overallRating: Math.round((foodRating + deliveryRating) / 2),
      foodQualityRating: foodRating,
      deliveryRating,
      selectedTags,
      comment
    });
    setSubmitted(true);
  };

  const handlePrintReceipt = () => {
    setIsReceiptSaved(true);
    setTimeout(() => setIsReceiptSaved(false), 2500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pb-24 pt-24 px-4 max-w-[480px] mx-auto w-full flex flex-col items-center justify-center text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#75f5a6] to-[#63e6ff] p-[2px] shadow-[0_0_24px_rgba(117,245,166,0.4)]">
          <div className="w-full h-full rounded-full bg-[#10182A] flex items-center justify-center text-[#75f5a6]">
            <span className="material-symbols-outlined text-[44px]">verified</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-space font-extrabold text-[#75f5a6] uppercase tracking-wider">
            MISSION COMPLETED & ARCHIVED
          </span>
          <h2 className="text-2xl font-extrabold text-[#F5F8FF] font-space">
            FEEDBACK CALIBRATED
          </h2>
          <p className="text-xs text-[#869396] max-w-xs">
            Your telemetry feedback has been recorded into the Hyderabad kitchen matrix.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-[#10182A] border border-[#ffd86b]/30 text-xs font-space text-[#ffd86b] flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">military_tech</span>
          <span>+50 DISHØ Cred points credited to your gold wallet!</span>
        </div>

        <button
          onClick={onBackToHome}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ba027b] to-[#63e6ff] text-black font-space font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          START NEW HYDERABAD MISSION
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 pt-20 px-4 max-w-[480px] mx-auto w-full space-y-5">
      {/* Top Banner */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-space font-bold tracking-widest text-[#75f5a6] uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#75f5a6]" />
            MISSION #DS-8821 COMPLETED
          </span>
          <span className="text-[10px] font-space text-[#869396]">
            Verified at 19:22:40
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-[#F5F8FF] font-space">
          ORDER SUMMARY & DEBRIEF
        </h2>
      </div>

      {/* Tabs: Receipt vs Rating */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('receipt')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-space font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'receipt'
              ? 'bg-[#63e6ff] text-black shadow-md'
              : 'bg-[#10182A] text-[#869396] border border-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">receipt_long</span>
          <span>DIGITAL TAX INVOICE</span>
        </button>
        <button
          onClick={() => setActiveTab('rating')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-space font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'rating'
              ? 'bg-[#63e6ff] text-black shadow-md'
              : 'bg-[#10182A] text-[#869396] border border-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">star</span>
          <span>RATE & DEBRIEF</span>
        </button>
      </div>

      {activeTab === 'receipt' ? (
        <div className="p-4 rounded-3xl bg-[#10182A] border border-white/10 space-y-4 shadow-xl">
          {/* Receipt Header */}
          <div className="flex items-start justify-between pb-3 border-b border-white/10">
            <div>
              <div className="font-space font-extrabold text-sm text-[#F5F8FF]">DISHØ OPERATING SYSTEM</div>
              <div className="text-[10px] text-[#869396] font-space">GSTIN: 36AAACD4192P1Z0 · Hyderabad</div>
              <div className="text-[10px] text-[#869396] font-space mt-0.5">Durgam Cable Fast Corridor Node</div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-space font-extrabold px-2 py-0.5 rounded bg-[#75f5a6]/20 text-[#75f5a6] border border-[#75f5a6]/30">
                PAID & VERIFIED
              </span>
              <div className="text-[10px] text-[#ffd86b] font-mono mt-1">OTP: 4192</div>
            </div>
          </div>

          {/* Delivery & Destination info */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-space pb-3 border-b border-white/5">
            <div>
              <span className="text-[#869396] block">CUSTOMER POD</span>
              <span className="text-[#F5F8FF] font-semibold">Rohit Pranav</span>
              <span className="text-[#869396] block truncate">Tower 3, Skyview Residences</span>
            </div>
            <div>
              <span className="text-[#869396] block">COURIER RUNNER</span>
              <span className="text-[#F5F8FF] font-semibold">Mohammed Imran</span>
              <span className="text-[#869396] block">TS-09-EX-4192 (Unit 41)</span>
            </div>
          </div>

          {/* Itemized Line Items */}
          <div className="space-y-2 text-xs font-space">
            <span className="text-[10px] font-bold text-[#869396] uppercase tracking-wider block">
              SYNTHESIS LINE ITEMS
            </span>

            <div className="flex items-center justify-between text-[#F5F8FF]">
              <div>
                <div>1x Nawabi Cyber Dum Biryani</div>
                <div className="text-[10px] text-[#869396]">Bawarchi Dum Lab · Extra Salan · Medium Spice</div>
              </div>
              <span className="font-bold tabular-nums">₹420</span>
            </div>

            <div className="flex items-center justify-between text-[#F5F8FF]">
              <div>
                <div>1x Deccan Volt Haleem</div>
                <div className="text-[10px] text-[#869396]">Pista House Forge · Desi Ghee Float · 38g Protein</div>
              </div>
              <span className="font-bold tabular-nums">₹340</span>
            </div>
          </div>

          {/* Cost Math */}
          <div className="space-y-1.5 pt-3 border-t border-white/10 text-[11px] font-space text-[#869396]">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="text-[#F5F8FF] tabular-nums">₹760</span>
            </div>
            <div className="flex justify-between">
              <span>Consolidated Co-Route Fee (2 Nodes)</span>
              <span className="text-[#F5F8FF] tabular-nums">₹55</span>
            </div>
            <div className="flex justify-between">
              <span>Thermal Insulation Pods</span>
              <span className="text-[#F5F8FF] tabular-nums">₹25</span>
            </div>
            <div className="flex justify-between">
              <span>GST & Hyderabad Municipality Cess (5%)</span>
              <span className="text-[#F5F8FF] tabular-nums">₹20</span>
            </div>
            <div className="flex justify-between text-[#75f5a6] font-semibold">
              <span>Voucher Savings (DURGAMDUO)</span>
              <span className="tabular-nums">-₹45</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold text-[#F5F8FF]">
              <span>TOTAL BILLED</span>
              <span className="text-[#ffd86b] tabular-nums text-base">₹815</span>
            </div>
            <div className="text-[10px] text-right text-[#869396]">
              Paid via Google Pay UPI (Transaction #TXN-984904192)
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handlePrintReceipt}
              className="flex-1 py-2.5 rounded-xl bg-[#181B27] border border-white/15 text-xs font-space font-bold text-[#63e6ff] hover:bg-[#63e6ff]/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isReceiptSaved ? 'check' : 'download'}
              </span>
              <span>{isReceiptSaved ? 'RECEIPT SAVED TO DOCK' : 'DOWNLOAD INVOICE PDF'}</span>
            </button>
            <button
              onClick={() => setActiveTab('rating')}
              className="px-4 py-2.5 rounded-xl bg-[#63e6ff] text-black text-xs font-space font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              RATE ORDER →
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Food Rating */}
          <div className="p-4 rounded-2xl bg-[#10182A]/80 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-[#F5F8FF] font-space uppercase block">
              CULINARY TASTE & DUM QUALITY
            </span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFoodRating(star)}
                  className="text-2xl text-[#ffd86b] cursor-pointer hover:scale-125 transition-transform"
                >
                  {star <= foodRating ? '★' : '☆'}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-[#869396] font-space block">
              {foodRating === 5 ? 'Exceptional: Saffron steam and meat tender at 104°C' : `${foodRating} Stars recorded`}
            </span>
          </div>

          {/* Delivery Rating */}
          <div className="p-4 rounded-2xl bg-[#10182A]/80 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-[#F5F8FF] font-space uppercase block">
              TRANSIT VELOCITY & TEMPERATURE
            </span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setDeliveryRating(star)}
                  className="text-2xl text-[#63e6ff] cursor-pointer hover:scale-125 transition-transform"
                >
                  {star <= deliveryRating ? '★' : '☆'}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-[#869396] font-space block">
              {deliveryRating === 5 ? 'Swift: Crossed Durgam Cable bridge in 14 minutes flat' : `${deliveryRating} Stars recorded`}
            </span>
          </div>

          {/* Tags */}
          <div className="p-4 rounded-2xl bg-[#10182A]/80 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-[#F5F8FF] font-space uppercase block">
              HIGHLIGHT ATTRIBUTES
            </span>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-space border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#63e6ff]/20 text-[#63e6ff] border-[#63e6ff]'
                        : 'bg-[#060914] text-[#869396] border-white/10'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div className="p-4 rounded-2xl bg-[#10182A]/80 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-[#F5F8FF] font-space uppercase block">
              CHEF & COURIER COMMENDATION
            </span>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell Bawarchi & Pista House master chefs what you loved..."
              className="w-full bg-[#060914] border border-white/10 rounded-xl p-3 text-xs text-[#F5F8FF] focus:outline-none focus:border-[#63e6ff]"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ba027b] to-[#63e6ff] text-black font-space font-extrabold text-sm uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            SUBMIT TELEMETRY & CLAIM +50 CRED
          </button>
        </div>
      )}
    </div>
  );
};
