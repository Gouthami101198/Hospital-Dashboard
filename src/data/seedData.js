import { DEPARTMENTS, WARDS } from "../utils/constants.js";

export function seedPatients() {
  const names = ["Ava Thompson", "Liam Carter", "Sophia Nguyen", "Noah Patel", "Isabella Rossi", "Mason Kim", "Mia Johansson", "Ethan Brooks", "Amara Okafor", "Lucas Fischer", "Chloe Bennett", "Daniel Osei", "Grace Lindqvist", "Ryan Alvarez", "Priya Sharma", "Jack Sullivan", "Elena Petrova", "Omar Haddad", "Freya Sørensen", "Mateo Vidal"];
  const genders = ["Female", "Male"];
  const bloods = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const statuses = ["Admitted", "Outpatient", "Discharged"];
  const doctors = ["Dr. Wren Halloway", "Dr. Idris Malik", "Dr. Renata Cole", "Dr. Samuel Ochieng", "Dr. Anya Volkov"];
  return names.map((name, i) => ({
    id: `P-${1001 + i}`,
    name,
    age: 18 + ((i * 7) % 60),
    gender: genders[i % 2],
    bloodGroup: bloods[i % bloods.length],
    contact: `+1 555-01${(10 + i).toString().padStart(2, "0")}`,
    email: name.toLowerCase().replace(/\s+/g, ".") + "@mail.com",
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    doctor: doctors[i % doctors.length],
    admissionDate: `2026-0${(i % 6) + 1}-${(10 + (i % 18)).toString().padStart(2, "0")}`,
    status: statuses[i % statuses.length],
  }));
}

export function seedDoctors() {
  const list = [
    ["Dr. Wren Halloway", "Cardiology"], ["Dr. Idris Malik", "Neurology"], ["Dr. Renata Cole", "Orthopedics"],
    ["Dr. Samuel Ochieng", "Pediatrics"], ["Dr. Anya Volkov", "Oncology"], ["Dr. Felix Lindberg", "General Medicine"],
    ["Dr. Naomi Reyes", "Dermatology"], ["Dr. Tobias Kruger", "ENT"], ["Dr. Layla Haddad", "Cardiology"],
    ["Dr. Owen Kavanagh", "Neurology"],
  ];
  const avail = ["Available", "In Surgery", "On Leave"];
  return list.map(([name, dept], i) => ({
    id: `D-${201 + i}`,
    name,
    specialization: dept,
    department: dept,
    experience: 4 + (i % 15),
    contact: `+1 555-02${(10 + i).toString().padStart(2, "0")}`,
    email: name.toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, ".") + "@vitalis.org",
    availability: avail[i % avail.length],
    schedule: i % 2 === 0 ? "Mon–Fri · 9:00–17:00" : "Tue–Sat · 10:00–18:00",
    rating: (3.8 + ((i * 13) % 12) / 10).toFixed(1),
  }));
}

export function seedAppointments(patients, doctors) {
  const types = ["Consultation", "Follow-up", "Emergency", "Screening"];
  const statuses = ["Scheduled", "Completed", "Cancelled"];
  return Array.from({ length: 16 }).map((_, i) => ({
    id: `A-${3001 + i}`,
    patientName: patients[i % patients.length].name,
    doctorName: doctors[i % doctors.length].name,
    department: doctors[i % doctors.length].department,
    date: `2026-08-${(4 + (i % 20)).toString().padStart(2, "0")}`,
    time: `${8 + (i % 9)}:${i % 2 === 0 ? "00" : "30"}`,
    type: types[i % types.length],
    status: statuses[i % statuses.length],
  }));
}

export function seedBeds() {
  const beds = [];
  WARDS.forEach((ward, wi) => {
    const count = ward === "ICU" ? 10 : 12;
    for (let i = 1; i <= count; i++) {
      const roll = (wi * 13 + i * 7) % 10;
      const status = roll < 5 ? "Occupied" : roll < 8 ? "Available" : roll === 8 ? "Cleaning" : "Maintenance";
      beds.push({
        id: `${ward.split(" ")[0].slice(0, 3).toUpperCase()}-${i.toString().padStart(2, "0")}`,
        ward,
        status,
        patient: status === "Occupied" ? ["Ava Thompson", "Liam Carter", "Sophia Nguyen", "Noah Patel", "Mia Johansson"][i % 5] : null,
        since: status === "Occupied" ? `2026-08-${(1 + (i % 5)).toString().padStart(2, "0")}` : null,
      });
    }
  });
  return beds;
}

export function seedPharmacy() {
  const meds = [
    ["Amoxicillin 500mg", "Antibiotic", "Capsule"], ["Paracetamol 650mg", "Analgesic", "Tablet"],
    ["Ibuprofen 400mg", "Anti-inflammatory", "Tablet"], ["Cetirizine 10mg", "Antihistamine", "Tablet"],
    ["Metformin 500mg", "Antidiabetic", "Tablet"], ["Amlodipine 5mg", "Antihypertensive", "Tablet"],
    ["Salbutamol Inhaler", "Bronchodilator", "Inhaler"], ["Omeprazole 20mg", "Antacid", "Capsule"],
    ["Insulin Glargine", "Antidiabetic", "Injection"], ["Azithromycin 250mg", "Antibiotic", "Tablet"],
    ["Atorvastatin 10mg", "Statin", "Tablet"], ["Vitamin D3 1000IU", "Supplement", "Softgel"],
    ["ORS Sachet", "Rehydration", "Sachet"], ["Diazepam 5mg", "Sedative", "Tablet"],
  ];
  return meds.map(([name, category, form], i) => {
    const stock = [4, 120, 8, 60, 0, 200, 15, 45, 3, 90, 30, 150, 70, 12][i];
    return {
      id: `RX-${501 + i}`,
      name, category, form,
      stock,
      unit: form,
      price: (2.5 + ((i * 3) % 20)).toFixed(2),
      expiry: `202${6 + (i % 3)}-${(3 + (i % 9)).toString().padStart(2, "0")}-15`,
      supplier: ["MedSource Inc.", "PharmaLink", "Global Meds Co."][i % 3],
      status: stock === 0 ? "Out of Stock" : stock < 15 ? "Low Stock" : "In Stock",
    };
  });
}

export function seedInvoices(patients) {
  const statuses = ["Paid", "Pending", "Overdue"];
  const methods = ["Card", "Insurance", "Cash", "Bank Transfer"];
  return Array.from({ length: 13 }).map((_, i) => ({
    id: `INV-${9001 + i}`,
    patientName: patients[i % patients.length].name,
    date: `2026-08-${(1 + (i % 20)).toString().padStart(2, "0")}`,
    items: 2 + (i % 5),
    amount: (85 + ((i * 137) % 1600)).toFixed(2),
    status: statuses[i % statuses.length],
    method: methods[i % methods.length],
  }));
}

export function seedNotifications() {
  const base = [
    ["appointment", "New appointment booked", "Ava Thompson booked a Cardiology consultation for Aug 12, 09:00."],
    ["emergency", "Emergency admission — ICU", "Trauma case admitted to ICU-04. Attending: Dr. Anya Volkov."],
    ["billing", "Invoice overdue", "INV-9004 for Noah Patel is 5 days overdue ($430.00)."],
    ["system", "Scheduled maintenance", "Pharmacy inventory sync will run tonight at 23:00."],
    ["appointment", "Appointment cancelled", "Liam Carter cancelled his 14:30 follow-up with Dr. Idris Malik."],
    ["billing", "Payment received", "Payment of $612.00 received for INV-9001."],
    ["system", "Low stock alert", "Insulin Glargine stock is critically low (3 units left)."],
    ["emergency", "Bed reassignment needed", "ICU is at 80% occupancy — consider reassigning stable patients."],
  ];
  return base.map(([type, title, message], i) => ({
    id: `N-${i + 1}`, type, title, message,
    time: `${i + 1}h ago`,
    read: i > 3,
  }));
}
