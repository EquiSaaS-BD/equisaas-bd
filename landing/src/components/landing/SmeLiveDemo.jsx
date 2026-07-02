import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  Printer, 
  Smartphone,
  ChevronRight,
  User,
  Package,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  { id: 1, name: "Napa Extend", price: 25, stock: 120, category: "Tablet" },
  { id: 2, name: "Sergel 20mg", price: 7, stock: 450, category: "Capsule" },
  { id: 3, name: "Savlon Liquid", price: 110, stock: 15, category: "Antiseptic" },
  { id: 4, name: "Fenadin 120", price: 8, stock: 85, category: "Tablet" },
];

export function SmeLiveDemo({ lang = "bn" }) {
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState("billing"); // billing, payment, success
  const [activeCategory, setActiveCategory] = useState("All");

  const addToCart = (product) => {
    setCart(curr => {
      const existing = curr.find(item => item.id === product.id);
      if (existing) {
        return curr.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...curr, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(curr => curr.map(item => {
      if (item.id === id) {
        const nextQty = Math.max(1, item.qty + delta);
        return { ...item, qty: nextQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(curr => curr.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const copy = (en, bn) => lang === "bn" ? bn : en;

  return (
    <Card className="glass-elite border-primary/20 shadow-2xl rounded-[2.5rem] overflow-hidden w-full max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-[1fr_350px] min-h-[600px]">
        {/* Left Side: Product Selection */}
        <div className="p-6 bg-background/40 backdrop-blur-md flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-black tracking-tight">{copy("Terminal 01", "টার্মিনাল ০১")}</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{copy("Operator: Al-Amin", "অপারেটর: আল-আমিন")}</p>
            </div>
            <div className="flex gap-2">
              {["All", "Tablet", "Capsule"].map(cat => (
                <Button 
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                  className="rounded-full text-[10px] font-black uppercase tracking-wider h-8"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[450px] pr-2 scrollbar-thin">
            {PRODUCTS.filter(p => activeCategory === "All" || p.category === activeCategory).map(product => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addToCart(product)}
                className="group cursor-pointer p-4 rounded-2xl border bg-card/50 hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Package className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm line-clamp-1">{product.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">৳{product.price}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">In Stock: {product.stock}</span>
                  <Plus className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-border/50 flex items-center gap-4">
            <Badge variant="outline" className="rounded-full px-3 py-1 border-primary/20 text-primary bg-primary/5">
              <Smartphone className="w-3 h-3 mr-1.5" />
              {copy("Cloud Sync: Active", "ক্লাউড সিঙ্ক: সচল")}
            </Badge>
            <p className="text-[10px] font-medium text-muted-foreground">v0.0.21-beta • {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Right Side: Cart & Checkout */}
        <div className="border-l border-border/50 bg-muted/30 backdrop-blur-xl flex flex-col p-6">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h3 className="font-black uppercase tracking-widest text-sm">{copy("Current Bill", "বর্তমান বিল")}</h3>
            <Badge className="ml-auto rounded-full bg-primary/10 text-primary border-0">{totalItems}</Badge>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            <AnimatePresence mode="popLayout">
              {cart.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-background/80 border shadow-sm group"
                >
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs truncate">{item.name}</h5>
                    <p className="text-[10px] text-muted-foreground">৳{item.price} x {item.qty}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-muted rounded"><Minus className="w-3 h-3" /></button>
                    <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-muted rounded"><Plus className="w-3 h-3" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-1 text-muted-foreground hover:text-red-500 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {cart.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-center opacity-40">
                <ShoppingCart className="w-10 h-10 mb-2" />
                <p className="text-xs font-medium">{copy("Cart is empty", "ব্যাগ খালি")}</p>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2 border-t border-border/50 pt-4">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">{copy("Subtotal", "সাবটোটাল")}</span>
                <span>৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-lg font-black tracking-tight">
                <span>{copy("Total", "মোট")}</span>
                <span className="text-primary">৳{subtotal}</span>
              </div>
            </div>

            <Button 
              disabled={cart.length === 0}
              onClick={() => setStep(step === "billing" ? "payment" : "success")}
              className="w-full h-12 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
            >
              {step === "billing" ? copy("Collect Payment", "পেমেন্ট নিন") : copy("Complete Order", "অর্ডার সম্পন্ন করুন")}
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {step === "success" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-primary flex flex-col items-center justify-center text-primary-foreground p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>
            <h3 className="text-3xl font-black tracking-tighter mb-2">{copy("Order Success!", "অর্ডার সফল হয়েছে!")}</h3>
            <p className="text-primary-foreground/80 font-medium max-w-xs">{copy("Bill #4029 generated and thermal printer triggered.", "বিল #৪০২৯ তৈরি হয়েছে এবং থার্মাল প্রিন্টার সচল হয়েছে।")}</p>
            <div className="flex gap-4 mt-8">
              <Button onClick={() => { setCart([]); setStep("billing"); }} variant="secondary" className="rounded-full px-8 h-12 font-bold">{copy("New Sale", "নতুন বিক্রয়")}</Button>
              <Button variant="outline" className="rounded-full px-8 h-12 font-bold border-white/20 hover:bg-white/10 text-white">
                <Printer className="w-4 h-4 mr-2" />
                {copy("Print Receipt", "রিসিট প্রিন্ট")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
