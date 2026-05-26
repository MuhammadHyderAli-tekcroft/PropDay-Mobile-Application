import AppTopHeader from '../../../components/AppTopHeader';
import ScreenShell from '../../../components/ScreenShell';
import Sidebar from '../../../components/Sidebar';
import { useCompanyNameQuery } from '../../../hooks/useCompanyNameQuery';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useSidebar } from '../../../hooks/useSidebar';

export default function DashboardScreen() {
    const { isAuthenticated } = useRequireAuth();
    const { companyName } = useCompanyNameQuery(isAuthenticated);
    const { isSidebarVisible, slideAnim, fadeAnim, openMenu, closeMenu, onSidebarNavigate } =
        useSidebar('Dashboard');

    if (!isAuthenticated) {
        return null;
    }

    return (
        <ScreenShell>
            <AppTopHeader companyName={companyName} onMenuPress={openMenu} />

            <Sidebar
                isVisible={isSidebarVisible}
                slideAnim={slideAnim}
                fadeAnim={fadeAnim}
                closeMenu={closeMenu}
                onNavigate={onSidebarNavigate}
                activeItem="Dashboard"
            />
        </ScreenShell>
    );
}
