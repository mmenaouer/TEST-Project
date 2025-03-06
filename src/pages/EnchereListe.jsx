import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AuctionList = () => {
    const navigate = useNavigate();
    // États pour gérer les filtres, la recherche et le tri
    const [auctions, setAuctions] = useState([]);
    const [filteredAuctions, setFilteredAuctions] = useState([]);
    const [activeFilter, setActiveFilter] = useState('الكل');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('الأحدث');
    const [loading, setLoading] = useState(true);

    // Simuler le chargement des données depuis une API
    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                // Simule un appel API
                setTimeout(() => {
                    const mockAuctions = [
                        {
                            id: 1,
                            title: "ساعة أنتيكة نادرة",
                            price: "3.500",
                            currentBid: 3500,
                            isLive: true,
                            endsAt: new Date(Date.now() + 3600000), // 1 heure
                            imageUrl: "https://www.claudeusercontent.com/api/placeholder/400/300",
                            category: "تحف وأنتيكات",
                            bidsCount: 15,
                            createdAt: new Date(Date.now() - 86400000) // 1 jour avant
                        },
                        {
                            id: 2,
                            title: "لوحة فنية مميزة",
                            price: "8.000",
                            currentBid: 8000,
                            isLive: false,
                            endsAt: new Date(Date.now() + 172800000), // 2 jours
                            imageUrl: "https://www.claudeusercontent.com/api/placeholder/400/300",
                            category: "فن وتصوير",
                            bidsCount: 7,
                            createdAt: new Date(Date.now() - 172800000) // 2 jours avant
                        },
                        {
                            id: 3,
                            title: "مجوهرات تراثية",
                            price: "12.000",
                            currentBid: 12000,
                            isLive: true,
                            endsAt: new Date(Date.now() + 7200000), // 2 heures
                            imageUrl: "https://www.claudeusercontent.com/api/placeholder/400/300",
                            category: "مجوهرات",
                            bidsCount: 22,
                            createdAt: new Date(Date.now() - 43200000) // 12 heures avant
                        },
                        {
                            id: 4,
                            title: "سيارة كلاسيكية",
                            price: "95.000",
                            currentBid: 95000,
                            isLive: false,
                            endsAt: new Date(Date.now() + 432000000), // 5 jours
                            imageUrl: "https://www.claudeusercontent.com/api/placeholder/400/300",
                            category: "سيارات",
                            bidsCount: 5,
                            createdAt: new Date(Date.now() - 259200000) // 3 jours avant
                        },
                        {
                            id: 5,
                            title: "منحوتة خشبية يدوية",
                            price: "5.500",
                            currentBid: 5500,
                            isLive: false,
                            endsAt: new Date(Date.now() + 21600000), // 6 heures
                            imageUrl: "https://www.claudeusercontent.com/api/placeholder/400/300",
                            category: "حرف يدوية",
                            bidsCount: 12,
                            createdAt: new Date(Date.now() - 129600000) // 1.5 jours avant
                        },
                        {
                            id: 6,
                            title: "مخطوطة أثرية نادرة",
                            price: "27.000",
                            currentBid: 27000,
                            isLive: true,
                            endsAt: new Date(Date.now() + 10800000), // 3 heures
                            imageUrl: "https://www.claudeusercontent.com/api/placeholder/400/300",
                            category: "كتب ومخطوطات",
                            bidsCount: 18,
                            createdAt: new Date(Date.now() - 21600000) // 6 heures avant
                        }
                    ];
                    setAuctions(mockAuctions);
                    setFilteredAuctions(mockAuctions);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    // Gérer le filtre des enchères
    useEffect(() => {
        if (auctions.length === 0) return;

        let result = [...auctions];

        // Appliquer le filtre actif
        if (activeFilter !== 'الكل') {
            switch (activeFilter) {
                case 'مباشر':
                    result = result.filter(auction => auction.isLive);
                    break;
                default:
                    break;
            }
        }

        // Appliquer la recherche
        if (searchQuery.trim() !== '') {
            result = result.filter(auction =>
                auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                auction.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Appliquer le tri
        switch (sortOption) {
            case 'الأحدث':
                result.sort((a, b) => b.createdAt - a.createdAt);
                break;
            case 'ينتهي قريبًا':
                result.sort((a, b) => a.endsAt - b.endsAt);
                break;
            case 'السعر: من الأعلى إلى الأقل':
                result.sort((a, b) => b.currentBid - a.currentBid);
                break;
            case 'السعر: من الأقل إلى الأعلى':
                result.sort((a, b) => a.currentBid - b.currentBid);
                break;
            case 'الأكثر مزايدات':
                result.sort((a, b) => b.bidsCount - a.bidsCount);
                break;
            default:
                break;
        }

        setFilteredAuctions(result);
    }, [auctions, activeFilter, searchQuery, sortOption]);

    // Fonction pour formater la date de fin en temps restant
    const formatTimeRemaining = (endDate) => {
        const now = new Date();
        const diffMs = endDate - now;
        
        if (diffMs <= 0) return "انتهى";

        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffHrs > 24) {
            const days = Math.floor(diffHrs / 24);
            return `${days} يوم`;
        } else if (diffHrs > 0) {
            return `${diffHrs} ساعة ${diffMins} دقيقة`;
        } else {
            return `${diffMins} دقيقة`;
        }
    };

    const handleViewDetails = (auctionId) => {
        navigate(`/auctionview/${auctionId}`);
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSortChange = (option) => {
        setSortOption(option);
    };

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section text-center">
                <div className="container">
                    <h1 className="display-5 fw-bold mb-4">استكشف المزادات النشطة</h1>
                    <p className="lead mb-0">اكتشف أفضل العروض وقدم مزايداتك على منتجات فريدة من نوعها</p>
                </div>
            </section>
            
            {/* Auctions Section */}
            <section className="py-5">
                <div className="container">
                    {/* Filters */}
                    <div className="row mb-4">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <div className="d-flex flex-wrap gap-2">
                                {['الكل', 'مباشر'].map((filter, index) => (
                                    <button 
                                        key={index} 
                                        className={`btn btn-sm ${activeFilter === filter ? 'btn-primary' : 'btn-outline-secondary'}`} 
                                        onClick={() => handleFilterChange(filter)}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="input-group">
                                <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {sortOption}
                                </button>
                                <ul className="dropdown-menu">
                                    {['الأحدث', 'ينتهي قريبًا', 'السعر: من الأعلى إلى الأقل', 'السعر: من الأقل إلى الأعلى', 'الأكثر مزايدات'].map((sort, index) => (
                                        <li key={index}>
                                            <a 
                                                className="dropdown-item" 
                                                href="#" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleSortChange(sort);
                                                }}
                                            >
                                                {sort}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="ابحث عن مزادات..." 
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <button className="btn btn-primary" type="button">
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Loading State */}
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">جاري التحميل...</span>
                            </div>
                            <p className="mt-2">جاري تحميل المزادات...</p>
                        </div>
                    ) : (
                        <>
                            {/* No Results Message */}
                            {filteredAuctions.length === 0 && (
                                <div className="alert alert-info text-center">
                                    لا توجد مزادات تطابق معايير البحث الخاصة بك
                                </div>
                            )}
                            
                            {/* Auctions Grid */}
                            <div className="row">
                                {filteredAuctions.map((auction) => (
                                    <div key={auction.id} className="col-md-6 col-lg-4 mb-4">
                                        <div className="card auction-card h-100">
                                            <div className="position-relative">
                                                <img 
                                                    src={auction.imageUrl} 
                                                    className="card-img-top auction-img" 
                                                    alt={auction.title} 
                                                />
                                                {auction.isLive && (
                                                    <span className="countdown-badge bg-danger live-badge">
                                                        <i className="fas fa-circle me-1"></i> مباشر الآن
                                                    </span>
                                                )}
                                                <span className="category-badge">{auction.category}</span>
                                                {!auction.isLive && (
                                                    <span className="countdown-badge bg-warning">
                                                        <i className="fas fa-clock me-1"></i> ينتهي خلال {formatTimeRemaining(auction.endsAt)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="card-body d-flex flex-column">
                                                <h5 className="card-title">{auction.title}</h5>
                                                <div className="d-flex justify-content-between mb-3">
                                                    <span className="auction-price text-danger text-end">{auction.price} درهم</span>
                                                    <span className="badge bg-info">
                                                        <i className="fas fa-gavel me-1"></i> {auction.bidsCount} مزايدة
                                                    </span>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => handleViewDetails(auction.id)} 
                                                    className="btn btn-outline-primary w-100 mt-auto"
                                                >
                                                    عرض التفاصيل
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    );
};

export default AuctionList;