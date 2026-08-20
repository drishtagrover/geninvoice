import { render } from "@testing-library/react";
import { AppContext } from "../context/AppContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

const baseAppContext = {
  baseURL: "http://localhost:8000/api",
  invoiceData: {},
  setInvoiceData: () => {},
  selectedTemplate: "template1",
  setSelectedTemplate: () => {},
  invoiceTitle: "",
  setInvoiceTitle: () => {},
  initialInvoiceData: {},
};

const baseAuthContext = {
  user: null,
  accessToken: null,
  isAuthenticated: true,
  loading: false,
  login: () => {},
  register: () => {},
  logout: () => {},
  getToken: () => Promise.resolve("test-token"),
};

export const renderWithProviders = (ui, { appContext = {}, authContext = {} } = {}) => {
  return render(
    <AppContext.Provider value={{ ...baseAppContext, ...appContext }}>
      <AuthContext.Provider value={{ ...baseAuthContext, ...authContext }}>
        {ui}
      </AuthContext.Provider>
    </AppContext.Provider>
  );
};