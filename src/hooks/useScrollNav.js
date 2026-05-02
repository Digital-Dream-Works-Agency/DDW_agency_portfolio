// src/hooks/useScrollNav.js
import { useNavigate, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';

export const useScrollNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const scrollToSection = (sectionId) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                scroller.scrollTo(sectionId, {
                    smooth: true,
                    offset: -100,
                    duration: 800,
                });
            }, 600);
        } else {
            scroller.scrollTo(sectionId, {
                smooth: true,
                offset: -100,
                duration: 800,
            });
        }
    };

    return { scrollToSection };
};