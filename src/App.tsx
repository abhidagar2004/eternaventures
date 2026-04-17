/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import GlobalStyleHandler from './components/GlobalStyleHandler';
import { Toaster } from 'react-hot-toast';
import DynamicPage from './pages/DynamicPage';
import ServicesPage from './pages/ServicesPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import BlogsPage from './pages/BlogsPage';
import BlogPost from './pages/BlogPost';
import ServiceDetail from './pages/ServiceDetail';
import AdminLayout from './pages/admin/AdminLayout';
import Login from './pages/admin/Login';
import ResetPassword from './pages/admin/ResetPassword';
import Dashboard from './pages/admin/Dashboard';
import ManageBlogs from './pages/admin/ManageBlogs';
import AddEditBlog from './pages/admin/AddEditBlog';
import ManageNavbar from './pages/admin/ManageNavbar';
import ManageCategories from './pages/admin/ManageCategories';
import ManageProjects from './pages/admin/ManageProjects';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import ManageLeads from './pages/admin/ManageLeads';
import ManageServices from './pages/admin/ManageServices';
import ManagePages from './pages/admin/ManagePages';
import EditPage from './pages/admin/EditPage';
import ManageServicesPage from './pages/admin/ManageServicesPage';
import ManageContactPage from './pages/admin/ManageContactPage';
import ManageGlobalSections from './pages/admin/ManageGlobalSections';
import ManageMedia from './pages/admin/ManageMedia';
import ManageAdmins from './pages/admin/ManageAdmins';
import ManageFooter from './pages/admin/ManageFooter';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <GlobalStyleHandler />
      <div className="min-h-screen bg-black text-white font-sans selection:bg-[#2596be] selection:text-white flex flex-col overflow-x-hidden">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<ManageLeads />} />
            <Route path="overview" element={<Dashboard />} />
            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="blogs/new" element={<AddEditBlog />} />
            <Route path="blogs/:id" element={<AddEditBlog />} />
            <Route path="navbar" element={<ManageNavbar />} />
            <Route path="footer" element={<ManageFooter />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="pages" element={<ManagePages />} />
            <Route path="pages/edit/:slug" element={<EditPage />} />
            <Route path="services-page" element={<ManageServicesPage />} />
            <Route path="contact-page" element={<ManageContactPage />} />
            <Route path="global-sections" element={<ManageGlobalSections />} />
            <Route path="services" element={<ManageServices />} />
            <Route path="testimonials" element={<ManageTestimonials />} />
            <Route path="media" element={<ManageMedia />} />
            <Route path="leads" element={<ManageLeads />} />
            <Route path="admins" element={<ManageAdmins />} />
          </Route>

          {/* Public Routes */}
          <Route path="*" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<DynamicPage systemSlug="home" />} />
                  <Route path="/about" element={<DynamicPage systemSlug="about" />} />
                  <Route path="/p/:slug" element={<DynamicPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/services/:slug" element={<ServiceDetail />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/blogs" element={<BlogsPage />} />
                  <Route path="/blogs/:slug" element={<BlogPost />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}
