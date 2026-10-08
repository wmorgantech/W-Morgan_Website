import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Products from "../pages/Products";
import Portfolio from "../pages/Portfolio";
import Careers from "../pages/Careers";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import { paths } from "./paths";

export default function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path={paths.home} element={<Home />} />
        <Route path={paths.about} element={<About />} />
        <Route path={paths.services} element={<Services />} />
        <Route path={paths.products} element={<Products />} />
        <Route path={paths.portfolio} element={<Portfolio />} />
        <Route path={paths.career} element={<Careers />} />
        <Route path={paths.contact} element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}
