import { ArrowDownLeft, ArrowUpRight, Boxes, Check, ChevronDown, History, Package, Pill, Plus, Search, ShieldCheck, ShoppingCart, SlidersHorizontal } from "lucide-react";

export const projectChapters = [
  { id: "pos", title: "Point of sale", caption: "From cart to recorded sale.", description: "I contributed to the point-of-sale screen and saving sales transactions to the MySQL database." },
  { id: "inventory", title: "Inventory", caption: "Stock that keeps up with sales.", description: "My inventory work includes records and automatic stock updates as items are sold." },
  { id: "history", title: "Transaction history", caption: "A clear record of what happened.", description: "I contributed to transaction history, including return and refund processing." },
] as const;

type Chapter = typeof projectChapters[number]["id"];
const medicines = [
  { name: "Paracetamol", dose: "500 mg", stock: 120, price: "3.50", category: "Pain relief" },
  { name: "Vitamin C", dose: "500 mg", stock: 85, price: "5.00", category: "Vitamins" },
  { name: "Amoxicillin", dose: "500 mg", stock: 42, price: "12.00", category: "Antibiotics" },
  { name: "Cetirizine", dose: "10 mg", stock: 60, price: "8.50", category: "Allergy relief" },
  { name: "Mefenamic Acid", dose: "500 mg", stock: 37, price: "6.00", category: "Pain relief" },
  { name: "Salbutamol", dose: "100 mcg", stock: 25, price: "180.00", category: "Respiratory" },
];
const navigation = [
  { id: "pos", label: "Point of sale", Icon: ShoppingCart },
  { id: "inventory", label: "Inventory", Icon: Boxes },
  { id: "history", label: "Transactions", Icon: History },
];

function PointOfSale() {
  return <div className="app-pos-layout">
    <div className="app-catalog">
      <h5>Products <span>Sample catalogue</span></h5>
      <div className="app-category-list"><span className="is-selected">All</span><span>Pain relief</span><span>Vitamins</span><span>Other</span></div>
      <div className="app-products">{medicines.map(medicine => <div className="app-product-row" key={medicine.name}>
        <span className="app-medicine-mark"><Pill size={19} strokeWidth={1.4} /></span>
        <div className="app-product-name"><strong>{medicine.name}</strong><span>{medicine.dose}</span></div>
        <span className="app-stock">In stock: {medicine.stock}</span>
        <b className="app-price">₱ {medicine.price}</b><span className="app-add">Add</span>
      </div>)}</div>
    </div>
    <div className="app-order">
      <h5>Current order <ShoppingCart size={15} /></h5>
      <div className="app-order-lines"><div><span>Paracetamol 500 mg<small>2 × ₱3.50</small></span><b>₱ 7.00</b></div><div><span>Vitamin C 500 mg<small>1 × ₱5.00</small></span><b>₱ 5.00</b></div><div><span>Mefenamic Acid<small>1 × ₱6.00</small></span><b>₱ 6.00</b></div></div>
      <div className="app-order-total"><span>Total <small>3 items · 4 units</small></span><strong>₱ 18.00</strong></div>
      <span className="app-complete">Complete transaction <ArrowUpRight size={16} /></span>
      <p className="app-preview-only">Interface preview only</p>
    </div>
  </div>;
}

function Inventory() {
  return <div className="app-ledger">
    <div className="app-ledger-title"><div><span>Stock management</span><h5>Inventory</h5></div><span className="app-outline-action"><Plus size={14} /> Product</span></div>
    <div className="app-ledger-tools"><span className="app-filter"><SlidersHorizontal size={14} /> All products</span><span>Sample stock records</span></div>
    <div className="app-table-wrap"><table className="app-table"><thead><tr><th>Product</th><th>Category</th><th>In stock</th><th>Status</th></tr></thead><tbody>{medicines.map((medicine, index) => <tr key={medicine.name}><td><strong>{medicine.name}</strong><small>{medicine.dose}</small></td><td>{medicine.category}</td><td>{index === 5 ? 8 : medicine.stock} <small>units</small></td><td><span className={index === 5 ? "app-state is-low" : "app-state"}>{index === 5 ? "Low stock" : "In stock"}</span></td></tr>)}</tbody></table></div>
    <div className="app-ledger-note"><Check size={15} /><span>Stock levels update with each recorded sale.</span></div>
  </div>;
}

function TransactionHistory() {
  const transactions = [
    ["#0048", "10:42 AM", "Sale", "₱ 18.00"], ["#0047", "10:31 AM", "Sale", "₱ 87.50"], ["#0046", "10:18 AM", "Refund", "−₱ 16.00"], ["#0045", "09:56 AM", "Sale", "₱ 35.00"], ["#0044", "09:35 AM", "Sale", "₱ 62.00"],
  ];
  return <div className="app-ledger">
    <div className="app-ledger-title"><div><span>Sales & returns</span><h5>Transaction history</h5></div><span className="app-outline-action"><History size={14} /> Records</span></div>
    <div className="app-ledger-tools"><span className="app-filter"><SlidersHorizontal size={14} /> All transactions</span><span>Sample transactions</span></div>
    <div className="app-table-wrap"><table className="app-table app-history-table"><thead><tr><th>Transaction</th><th>Time</th><th>Type</th><th>Amount</th></tr></thead><tbody>{transactions.map(([id, time, type, amount]) => <tr key={id}><td><span className="app-transaction-id">{type === "Refund" ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}<strong>{id}</strong></span></td><td>{time}</td><td><span className={type === "Refund" ? "app-state is-refund" : "app-state"}>{type}</span></td><td>{amount}</td></tr>)}</tbody></table></div>
    <div className="app-ledger-note"><ShieldCheck size={16} /><span>Sales, returns and refunds in one transaction record.</span></div>
  </div>;
}

/** A static illustration built with HTML. The app-like labels do not perform transactions. */
export function PharmacyPreview({ chapter }: { chapter: Chapter }) {
  const title = projectChapters.find(item => item.id === chapter)!.title;
  return <div className="work-app-preview" role="img" aria-label={`Illustrative Pharxmaco ${title.toLowerCase()} interface using sample data, not an actual application screenshot.`}>
    <div className="app-preview-inner" aria-hidden="true">
      <aside className="app-sidebar">
        <div className="app-brand"><Plus size={29} strokeWidth={4} /><div><strong>Pharxmaco</strong><span>Point of sale & inventory</span></div></div>
        <div className="app-sidebar-nav">{navigation.map(({ id, label, Icon }) => <span key={id} className={chapter === id ? "is-selected" : undefined}><Icon size={17} strokeWidth={1.6} /><span>{label}</span></span>)}<span><Package size={17} strokeWidth={1.6} /><span>Products</span></span></div>
        <div className="app-staff"><span>C</span><div><strong>Cashier</strong><small>Staff workspace</small></div><ChevronDown size={13} /></div>
      </aside>
      <div className="app-workspace">
        <div className="app-toolbar"><div className="app-search"><Search size={15} /><span>{chapter === "history" ? "Search transactions" : "Search medicine, brand or barcode"}</span></div><span className="app-sample-label">Sample data</span></div>
        <div className="app-screen">{chapter === "pos" ? <PointOfSale /> : chapter === "inventory" ? <Inventory /> : <TransactionHistory />}</div>
      </div>
    </div>
  </div>;
}
