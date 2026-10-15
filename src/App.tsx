import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DemoProvider } from './store/DemoStore';
import { ScrollManager, SiteLayout } from './components/site/SiteChrome';
import { RequireRole } from './components/portal/Shell';
import { Toasts } from './components/ui/Overlay';
import Home from './pages/site/Home';
import { About, Contact, Farms, InvestorRelations, Journal, JournalArticle, Legal, WhatWeDo } from './pages/site/Pages';
import DemoEntry from './pages/DemoEntry';
import Dashboard from './pages/investor/Dashboard';
import Investments, { InvestmentDetail } from './pages/investor/Investments';
import { Milestones, UpdateDetail, Updates } from './pages/investor/Journal';
import Harvest from './pages/investor/Harvest';
import Documents from './pages/investor/Documents';
import { Notifications, Profile } from './pages/investor/Account';
import Messages from './pages/shared/Messages';
import AdminOverview from './pages/admin/Overview';
import { InvestorProfile, Investors } from './pages/admin/People';
import { ProjectAdmin, Projects } from './pages/admin/Projects';
import { PublishingEditor, PublishingList } from './pages/admin/Publishing';
import Decisions from './pages/admin/Decisions';

// HashRouter keeps the demo working from a single static file or any static host.
export default function App() {
  return (
    <DemoProvider>
      <HashRouter>
        <ScrollManager />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="farms" element={<Farms />} />
            <Route path="what-we-do" element={<WhatWeDo />} />
            <Route path="investors" element={<InvestorRelations />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="journal" element={<Journal />} />
            <Route path="journal/:id" element={<JournalArticle />} />
            <Route path="legal/:doc" element={<Legal />} />
          </Route>

          <Route path="portal" element={<DemoEntry />} />
          <Route path="portal" element={<RequireRole role="investor" />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="investments" element={<Investments />} />
            <Route path="investments/:id" element={<InvestmentDetail />} />
            <Route path="updates" element={<Updates />} />
            <Route path="updates/:id" element={<UpdateDetail />} />
            <Route path="milestones" element={<Milestones />} />
            <Route path="harvest" element={<Harvest />} />
            <Route path="messages" element={<Messages side="investor" />} />
            <Route path="messages/:id" element={<Messages side="investor" />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="documents" element={<Documents />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="admin" element={<RequireRole role="admin" />}>
            <Route index element={<AdminOverview />} />
            <Route path="investors" element={<Investors />} />
            <Route path="investors/:id" element={<InvestorProfile />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectAdmin />} />
            <Route path="publishing" element={<PublishingList />} />
            <Route path="publishing/new" element={<PublishingEditor />} />
            <Route path="publishing/:id" element={<PublishingEditor />} />
            <Route path="decisions" element={<Decisions />} />
            <Route path="messages" element={<Messages side="team" />} />
            <Route path="messages/:id" element={<Messages side="team" />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toasts />
      </HashRouter>
    </DemoProvider>
  );
}
