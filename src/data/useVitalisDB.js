import { useReducer } from "react";
import { seedPatients, seedDoctors, seedAppointments, seedBeds, seedPharmacy, seedInvoices, seedNotifications } from "./seedData.js";

export function dbReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return { ...state, [action.resource]: [action.payload, ...state[action.resource]] };
    case "UPDATE":
      return { ...state, [action.resource]: state[action.resource].map((it) => (it.id === action.payload.id ? action.payload : it)) };
    case "DELETE":
      return { ...state, [action.resource]: state[action.resource].filter((it) => it.id !== action.payload) };
    case "SET":
      return { ...state, [action.resource]: action.payload };
    default:
      return state;
  }
}

export function useVitalisDB() {
  const [state, dispatch] = useReducer(dbReducer, null, () => {
    const patients = seedPatients();
    const doctors = seedDoctors();
    return {
      patients,
      doctors,
      appointments: seedAppointments(patients, doctors),
      beds: seedBeds(),
      pharmacy: seedPharmacy(),
      invoices: seedInvoices(patients),
      notifications: seedNotifications(),
    };
  });
  return { state, dispatch };
}
