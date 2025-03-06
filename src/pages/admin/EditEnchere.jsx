import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SlideAdmin from '../../components/SlideAdmin';


function EditEnchere() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    
    // États pour les champs du formulaire
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [startPrice, setStartPrice] = useState('');
    const [expectedPrice, setExpectedPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [images, setImages] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [specifications, setSpecifications] = useState([
        { key: '', value: '' }
    ]);
    const [newImageFile, setNewImageFile] = useState(null);
    const [newDocumentFile, setNewDocumentFile] = useState(null);
    const [newDocumentName, setNewDocumentName] = useState('');
    const [location, setLocation] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [minBidIncrement, setMinBidIncrement] = useState('');
    
    // Simuler le chargement des données depuis l'API
    useEffect(() => {
        const fetchAuctionData = async () => {
            try {
                // Simuler un délai d'API
                setTimeout(() => {
                    // Données simulées d'une enchère
                    const auctionData = {
                        id: id,
                        title: 'سيارة مرسيدس كلاسيكية 1965',
                        category: 'سيارات',
                        description: 'سيارة كلاسيكية نادرة في حالة ممتازة، تم ترميمها بالكامل مع الحفاظ على أصالتها. تعتبر هذه السيارة من أيقونات التصميم الألماني في ستينيات القرن العشرين.',
                        startPrice: '150000',
                        expectedPrice: '200000',
                        startDate: '2025-02-28T10:00',
                        endDate: '2025-03-03T10:00',
                        status: 'مجدول',
                        location: 'الدار البيضاء، المغرب',
                        depositAmount: '15000',
                        minBidIncrement: '1000',
                        specifications: [
                            { key: 'رقم الشاسيه', value: 'MER19650023145' },
                            { key: 'سنة الصنع', value: '1965' },
                            { key: 'المحرك', value: '6 اسطوانات' },
                            { key: 'عدد الكيلومترات', value: '86,200 كم' },
                            { key: 'حالة السيارة', value: 'ممتازة (مجددة)' }
                        ],
                        images: [
                            { id: 1, url: 'https://www.claudeusercontent.com/api/placeholder/800/600?text=1', isPrimary: true },
                            { id: 2, url: 'https://www.claudeusercontent.com/api/placeholder/800/600?text=2', isPrimary: false },
                            { id: 3, url: 'https://www.claudeusercontent.com/api/placeholder/800/600?text=3', isPrimary: false },
                        ],
                        documents: [
                            { id: 1, name: 'شهادة فحص السيارة', url: '#' },
                            { id: 2, name: 'تاريخ الصيانة', url: '#' },
                            { id: 3, name: 'شهادة أصالة', url: '#' },
                            { id: 4, name: 'وثائق الترميم', url: '#' }
                        ]
                    };
                    
                    // Mettre à jour tous les états
                    setTitle(auctionData.title);
                    setCategory(auctionData.category);
                    setDescription(auctionData.description);
                    setStartPrice(auctionData.startPrice);
                    setExpectedPrice(auctionData.expectedPrice);
                    setStartDate(auctionData.startDate);
                    setEndDate(auctionData.endDate);
                    setStatus(auctionData.status);
                    setLocation(auctionData.location);
                    setDepositAmount(auctionData.depositAmount);
                    setMinBidIncrement(auctionData.minBidIncrement);
                    setSpecifications(auctionData.specifications);
                    setImages(auctionData.images);
                    setDocuments(auctionData.documents);
                    
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
                setLoading(false);
            }
        };
        
        fetchAuctionData();
    }, [id]);
    
    // Soumettre le formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        // Simuler une requête API
        setTimeout(() => {
            setSubmitting(false);
            setSuccessMessage('تم تحديث المزاد بنجاح');
            setShowSuccessToast(true);
            
            // Masquer le toast après 3 secondes
            setTimeout(() => {
                setShowSuccessToast(false);
                navigate('/bakend'); // Rediriger vers la page d'administration
            }, 3000);
        }, 1500);
    };
    
    // Annuler l'édition
    const handleCancel = () => {
        // Utiliser un modal de confirmation au lieu de window.confirm
        document.getElementById('cancelConfirmModal').classList.add('show');
        document.getElementById('cancelConfirmModal').style.display = 'block';
        document.body.classList.add('modal-open');
        // Ajouter un backdrop modal
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
    };
    
    // Confirmer l'annulation et retourner à la page d'administration
    const confirmCancel = () => {
        // Fermer le modal
        document.getElementById('cancelConfirmModal').classList.remove('show');
        document.getElementById('cancelConfirmModal').style.display = 'none';
        document.body.classList.remove('modal-open');
        document.querySelector('.modal-backdrop')?.remove();
        
        // Rediriger vers la page d'administration
        navigate('/bakend');
    };
    
    // Gérer l'ajout d'une spécification
    const addSpecification = () => {
        setSpecifications([...specifications, { key: '', value: '' }]);
    };
    
    // Gérer la suppression d'une spécification
    const removeSpecification = (index) => {
        const newSpecs = [...specifications];
        newSpecs.splice(index, 1);
        setSpecifications(newSpecs);
    };
    
    // Gérer les changements dans les spécifications
    const handleSpecificationChange = (index, field, value) => {
        const newSpecs = [...specifications];
        newSpecs[index][field] = value;
        setSpecifications(newSpecs);
    };
    
    // Gérer la suppression d'une image
    const removeImage = (imageId) => {
        // Ouvrir le modal de confirmation
        document.getElementById('deleteImageConfirmModal').classList.add('show');
        document.getElementById('deleteImageConfirmModal').style.display = 'block';
        document.body.classList.add('modal-open');
        // Ajouter un backdrop modal
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
        
        // Stocker l'ID de l'image à supprimer dans un attribut data du bouton de confirmation
        document.getElementById('confirmDeleteImageBtn').setAttribute('data-image-id', imageId);
    };
    
    // Confirmer la suppression d'une image
    const confirmRemoveImage = () => {
        // Récupérer l'ID de l'image à supprimer
        const imageId = parseInt(document.getElementById('confirmDeleteImageBtn').getAttribute('data-image-id'));
        
        // Supprimer l'image
        setImages(images.filter(img => img.id !== imageId));
        
        // Fermer le modal
        document.getElementById('deleteImageConfirmModal').classList.remove('show');
        document.getElementById('deleteImageConfirmModal').style.display = 'none';
        document.body.classList.remove('modal-open');
        document.querySelector('.modal-backdrop')?.remove();
        
        // Afficher un toast de succès
        setSuccessMessage('تم حذف الصورة بنجاح');
        setShowSuccessToast(true);
        
        // Masquer le toast après 3 secondes
        setTimeout(() => {
            setShowSuccessToast(false);
        }, 3000);
    };
    
    // Définir une image comme principale
    const setAsPrimaryImage = (imageId) => {
        setImages(images.map(img => ({
            ...img,
            isPrimary: img.id === imageId
        })));
    };
    
    // Gérer la suppression d'un document
    const removeDocument = (docId) => {
        // Ouvrir le modal de confirmation
        document.getElementById('deleteDocumentConfirmModal').classList.add('show');
        document.getElementById('deleteDocumentConfirmModal').style.display = 'block';
        document.body.classList.add('modal-open');
        // Ajouter un backdrop modal
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
        
        // Stocker l'ID du document à supprimer dans un attribut data du bouton de confirmation
        document.getElementById('confirmDeleteDocumentBtn').setAttribute('data-document-id', docId);
    };
    
    // Confirmer la suppression d'un document
    const confirmRemoveDocument = () => {
        // Récupérer l'ID du document à supprimer
        const docId = parseInt(document.getElementById('confirmDeleteDocumentBtn').getAttribute('data-document-id'));
        
        // Supprimer le document
        setDocuments(documents.filter(doc => doc.id !== docId));
        
        // Fermer le modal
        document.getElementById('deleteDocumentConfirmModal').classList.remove('show');
        document.getElementById('deleteDocumentConfirmModal').style.display = 'none';
        document.body.classList.remove('modal-open');
        document.querySelector('.modal-backdrop')?.remove();
        
        // Afficher un toast de succès
        setSuccessMessage('تم حذف المستند بنجاح');
        setShowSuccessToast(true);
        
        // Masquer le toast après 3 secondes
        setTimeout(() => {
            setShowSuccessToast(false);
        }, 3000);
    };
    
    // Gérer l'upload d'une nouvelle image
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("حجم الملف كبير جدًا. الحد الأقصى هو 5 ميجابايت");
                e.target.value = "";
                return;
            }
            
            setNewImageFile(file);
            
            // Créer un aperçu de l'image et l'ajouter à la liste
            const reader = new FileReader();
            reader.onload = (event) => {
                const newImageId = images.length > 0 ? Math.max(...images.map(img => img.id)) + 1 : 1;
                const newImage = {
                    id: newImageId,
                    url: event.target.result,
                    isPrimary: images.length === 0, // Si c'est la première image, la définir comme principale
                    file: file
                };
                
                setImages([...images, newImage]);
                setNewImageFile(null); // Réinitialiser après l'ajout
                
                // Réinitialiser le champ de fichier
                e.target.value = "";
            };
            reader.readAsDataURL(file);
        }
    };
    
    // Gérer l'upload d'un nouveau document
    const handleDocumentUpload = (e) => {
        e.preventDefault();
        const file = newDocumentFile;
        
        if (!file || !newDocumentName.trim()) {
            alert("الرجاء اختيار ملف وإدخال اسم المستند");
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            alert("حجم الملف كبير جدًا. الحد الأقصى هو 10 ميجابايت");
            return;
        }
        
        // Ajouter le document à la liste
        const newDocId = documents.length > 0 ? Math.max(...documents.map(doc => doc.id)) + 1 : 1;
        const newDocument = {
            id: newDocId,
            name: newDocumentName,
            url: '#',
            file: file
        };
        
        setDocuments([...documents, newDocument]);
        
        // Réinitialiser les champs
        setNewDocumentFile(null);
        setNewDocumentName('');
        
        // Fermer le modal
        document.getElementById('documentUploadModal').classList.remove('show');
        document.querySelector('.modal-backdrop')?.remove();
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    };
    
    // Obtenir le style de badge pour le statut
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'نشط': return 'bg-success';
            case 'مجدول': return 'bg-warning text-dark';
            case 'مكتمل': return 'bg-secondary';
            case 'مسودة': return 'bg-info';
            default: return 'bg-secondary';
        }
    };
    
    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <SlideAdmin />
                {/* Main Content */}
                <div className="col-lg-10 py-4">
                    <div className="container direction_rtl">
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="page-title">
                                <i className="fas fa-edit me-2"></i> تعديل المزاد {loading ? '' : `#${id}`}
                            </h2>
                            <div>
                                <button 
                                    className="btn btn-outline-secondary ms-2" 
                                    onClick={handleCancel}
                                    disabled={submitting}
                                >
                                    <i className="fas fa-times me-1"></i> إلغاء
                                </button>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleSubmit}
                                    disabled={submitting || loading}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            جارٍ الحفظ...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save me-1"></i> حفظ التغييرات
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        {/* Loading State */}
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">جاري التحميل...</span>
                                </div>
                                <p className="mt-2">جاري تحميل بيانات المزاد...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="card mb-4">
                                    <div className="card-header bg-primary text-white">
                                        <h5 className="mb-0">المعلومات الأساسية</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label htmlFor="title" className="form-label">عنوان المزاد <span className="text-danger">*</span></label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="title" 
                                                    value={title} 
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="category" className="form-label">الفئة <span className="text-danger">*</span></label>
                                                <select 
                                                    className="form-select" 
                                                    id="category" 
                                                    value={category} 
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    required
                                                >
                                                    <option value="">اختر الفئة</option>
                                                    <option value="سيارات">سيارات</option>
                                                    <option value="عقارات">عقارات</option>
                                                    <option value="مجوهرات">مجوهرات</option>
                                                    <option value="إلكترونيات">إلكترونيات</option>
                                                    <option value="تحف وأنتيكات">تحف وأنتيكات</option>
                                                    <option value="فن وتصوير">فن وتصوير</option>
                                                    <option value="حرف يدوية">حرف يدوية</option>
                                                    <option value="كتب ومخطوطات">كتب ومخطوطات</option>
                                                    <option value="أخرى">أخرى</option>
                                                </select>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="description" className="form-label">وصف المزاد <span className="text-danger">*</span></label>
                                                <textarea 
                                                    className="form-control" 
                                                    id="description" 
                                                    rows="4" 
                                                    value={description} 
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    required
                                                ></textarea>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="location" className="form-label">الموقع <span className="text-danger">*</span></label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="location" 
                                                    value={location} 
                                                    onChange={(e) => setLocation(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="status" className="form-label">حالة المزاد <span className="text-danger">*</span></label>
                                                <select 
                                                    className="form-select" 
                                                    id="status" 
                                                    value={status} 
                                                    onChange={(e) => setStatus(e.target.value)}
                                                    required
                                                >
                                                    <option value="">اختر الحالة</option>
                                                    <option value="مسودة">مسودة</option>
                                                    <option value="مجدول">مجدول</option>
                                                    <option value="نشط">نشط</option>
                                                    <option value="مكتمل">مكتمل</option>
                                                </select>
                                                <div className="form-text">
                                                    الحالة الحالية: <span className={`badge ${getStatusBadgeClass(status)} ms-1`}>{status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="card mb-4">
                                    <div className="card-header bg-primary text-white">
                                        <h5 className="mb-0">تفاصيل المزايدة</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label htmlFor="startPrice" className="form-label">السعر الابتدائي (درهم) <span className="text-danger">*</span></label>
                                                <input 
                                                    type="number" 
                                                    className="form-control" 
                                                    id="startPrice" 
                                                    value={startPrice} 
                                                    onChange={(e) => setStartPrice(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="expectedPrice" className="form-label">السعر المتوقع (درهم)</label>
                                                <input 
                                                    type="number" 
                                                    className="form-control" 
                                                    id="expectedPrice" 
                                                    value={expectedPrice} 
                                                    onChange={(e) => setExpectedPrice(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="depositAmount" className="form-label">مبلغ التأمين (درهم) <span className="text-danger">*</span></label>
                                                <input 
                                                    type="number" 
                                                    className="form-control" 
                                                    id="depositAmount" 
                                                    value={depositAmount} 
                                                    onChange={(e) => setDepositAmount(e.target.value)}
                                                    required
                                                />
                                                <div className="form-text">عادة 10% من السعر الابتدائي</div>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="minBidIncrement" className="form-label">الحد الأدنى للزيادة (درهم) <span className="text-danger">*</span></label>
                                                <input 
                                                    type="number" 
                                                    className="form-control" 
                                                    id="minBidIncrement" 
                                                    value={minBidIncrement} 
                                                    onChange={(e) => setMinBidIncrement(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="startDate" className="form-label">تاريخ بدء المزاد <span className="text-danger">*</span></label>
                                                <input 
                                                    type="datetime-local" 
                                                    className="form-control" 
                                                    id="startDate" 
                                                    value={startDate} 
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="endDate" className="form-label">تاريخ انتهاء المزاد <span className="text-danger">*</span></label>
                                                <input 
                                                    type="datetime-local" 
                                                    className="form-control" 
                                                    id="endDate" 
                                                    value={endDate} 
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="card mb-4">
                                    <div className="card-header bg-primary text-white">
                                        <h5 className="mb-0">المواصفات</h5>
                                    </div>
                                    <div className="card-body">
                                        {specifications.map((spec, index) => (
                                            <div className="row g-2 mb-2 align-items-center" key={index}>
                                                <div className="col-md-5">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        placeholder="اسم الخاصية" 
                                                        value={spec.key} 
                                                        onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-5">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        placeholder="القيمة" 
                                                        value={spec.value} 
                                                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-outline-danger" 
                                                        onClick={() => removeSpecification(index)}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-primary mt-2" 
                                            onClick={addSpecification}
                                        >
                                            <i className="fas fa-plus me-1"></i> إضافة خاصية
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="card mb-4">
                                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">الصور</h5>
                                        <label htmlFor="uploadImage" className="btn btn-light btn-sm m-0">
                                            <i className="fas fa-upload me-1"></i> رفع صور جديدة
                                            <input 
                                                type="file" 
                                                id="uploadImage" 
                                                onChange={handleImageUpload}
                                                accept="image/*" 
                                                className="d-none"
                                            />
                                        </label>
                                    </div>
                                    <div className="card-body">
                                        {images.length === 0 ? (
                                            <div className="text-center py-4">
                                                <i className="fas fa-images fa-3x text-muted mb-3"></i>
                                                <p>لم يتم إضافة أي صور بعد</p>
                                                <label htmlFor="uploadImageEmpty" className="btn btn-primary m-0">
                                                    <i className="fas fa-upload me-1"></i> رفع صور
                                                    <input 
                                                        type="file" 
                                                        id="uploadImageEmpty" 
                                                        onChange={handleImageUpload}
                                                        accept="image/*" 
                                                        className="d-none"
                                                    />
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="row">
                                                {images.map((image) => (
                                                    <div className="col-md-4 mb-3" key={image.id}>
                                                        <div className={`card h-100 ${image.isPrimary ? 'border-primary' : ''}`}>
                                                            <div className="position-relative">
                                                                <img 
                                                                    src={image.url} 
                                                                    className="card-img-top" 
                                                                    alt={`صورة ${image.id}`}
                                                                    style={{ height: "150px", objectFit: "cover" }}
                                                                />
                                                                {image.isPrimary && (
                                                                    <span className="position-absolute top-0 start-0 badge bg-primary m-2">
                                                                        الصورة الرئيسية
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="card-body">
                                                                <div className="d-flex justify-content-between">
                                                                    <button 
                                                                        type="button" 
                                                                        className="btn btn-sm btn-outline-danger" 
                                                                        onClick={() => removeImage(image.id)}
                                                                    >
                                                                        <i className="fas fa-trash"></i>
                                                                    </button>
                                                                    {!image.isPrimary && (
                                                                        <button 
                                                                            type="button" 
                                                                            className="btn btn-sm btn-outline-primary" 
                                                                            onClick={() => setAsPrimaryImage(image.id)}
                                                                        >
                                                                            تعيين كصورة رئيسية
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="card mb-4">
                                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">المستندات</h5>
                                        <button type="button" className="btn btn-light btn-sm" data-bs-toggle="modal" data-bs-target="#documentUploadModal">
                                            <i className="fas fa-upload me-1"></i> رفع مستندات جديدة
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        {documents.length === 0 ? (
                                            <div className="text-center py-4">
                                                <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
                                                <p>لم يتم إضافة أي مستندات بعد</p>
                                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#documentUploadModal">
                                                    <i className="fas fa-upload me-1"></i> رفع مستندات
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-bordered">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>اسم المستند</th>
                                                            <th style={{ width: "150px" }}>الإجراءات</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {documents.map((doc) => (
                                                            <tr key={doc.id}>
                                                                <td>
                                                                    <i className="fas fa-file-pdf text-danger me-2"></i>
                                                                    {doc.name}
                                                                </td>
                                                                <td>
                                                                    <div className="btn-group btn-group-sm">
                                                                        <button 
                                                                            type="button" 
                                                                            className="btn btn-outline-primary"
                                                                        >
                                                                            <i className="fas fa-eye"></i>
                                                                        </button>
                                                                        <button 
                                                                            type="button" 
                                                                            className="btn btn-outline-danger"
                                                                            onClick={() => removeDocument(doc.id)}
                                                                        >
                                                                            <i className="fas fa-trash"></i>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="d-flex justify-content-end mb-4">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary me-2" 
                                        onClick={handleCancel}
                                        disabled={submitting}
                                    >
                                        <i className="fas fa-times me-1"></i> إلغاء
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary" 
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                جارٍ الحفظ...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save me-1"></i> حفظ التغييرات
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                        
                        
                        {/* Modal de confirmation d'annulation */}
                        <div className="modal fade" id="cancelConfirmModal" tabIndex="-1" aria-hidden="true" style={{ display: 'none' }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header bg-danger text-white">
                                        <h5 className="modal-title">تأكيد الإلغاء</h5>
                                        <button 
                                            type="button" 
                                            className="btn-close btn-close-white" 
                                            onClick={() => {
                                                document.getElementById('cancelConfirmModal').classList.remove('show');
                                                document.getElementById('cancelConfirmModal').style.display = 'none';
                                                document.body.classList.remove('modal-open');
                                                document.querySelector('.modal-backdrop')?.remove();
                                            }}
                                        ></button>
                                    </div>
                                    <div className="modal-body text-center p-4">
                                        <i className="fas fa-exclamation-triangle text-warning fa-3x mb-3"></i>
                                        <p className="mb-0 fs-5">هل أنت متأكد من رغبتك في إلغاء التعديلات؟</p>
                                        <p className="text-muted">سيتم فقدان جميع التغييرات التي قمت بها.</p>
                                    </div>
                                    <div className="modal-footer justify-content-center">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary px-4" 
                                            onClick={() => {
                                                document.getElementById('cancelConfirmModal').classList.remove('show');
                                                document.getElementById('cancelConfirmModal').style.display = 'none';
                                                document.body.classList.remove('modal-open');
                                                document.querySelector('.modal-backdrop')?.remove();
                                            }}
                                        >
                                            لا، العودة للتحرير
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-danger px-4" 
                                            onClick={confirmCancel}
                                        >
                                            نعم، إلغاء التعديلات
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Modal de confirmation de suppression d'image */}
                        <div className="modal fade" id="deleteImageConfirmModal" tabIndex="-1" aria-hidden="true" style={{ display: 'none' }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header bg-danger text-white">
                                        <h5 className="modal-title">تأكيد الحذف</h5>
                                        <button 
                                            type="button" 
                                            className="btn-close btn-close-white" 
                                            onClick={() => {
                                                document.getElementById('deleteImageConfirmModal').classList.remove('show');
                                                document.getElementById('deleteImageConfirmModal').style.display = 'none';
                                                document.body.classList.remove('modal-open');
                                                document.querySelector('.modal-backdrop')?.remove();
                                            }}
                                        ></button>
                                    </div>
                                    <div className="modal-body text-center p-4">
                                        <i className="fas fa-exclamation-triangle text-warning fa-3x mb-3"></i>
                                        <p className="mb-0 fs-5">هل أنت متأكد من رغبتك في حذف هذه الصورة؟</p>
                                        <p className="text-muted">لا يمكن التراجع عن هذا الإجراء.</p>
                                    </div>
                                    <div className="modal-footer justify-content-center">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary px-4" 
                                            onClick={() => {
                                                document.getElementById('deleteImageConfirmModal').classList.remove('show');
                                                document.getElementById('deleteImageConfirmModal').style.display = 'none';
                                                document.body.classList.remove('modal-open');
                                                document.querySelector('.modal-backdrop')?.remove();
                                            }}
                                        >
                                            إلغاء
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-danger px-4" 
                                            id="confirmDeleteImageBtn"
                                            onClick={confirmRemoveImage}
                                        >
                                            <i className="fas fa-trash me-1"></i> حذف
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Modal de confirmation de suppression de document */}
                        <div className="modal fade" id="deleteDocumentConfirmModal" tabIndex="-1" aria-hidden="true" style={{ display: 'none' }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header bg-danger text-white">
                                        <h5 className="modal-title">تأكيد الحذف</h5>
                                        <button 
                                            type="button" 
                                            className="btn-close btn-close-white" 
                                            onClick={() => {
                                                document.getElementById('deleteDocumentConfirmModal').classList.remove('show');
                                                document.getElementById('deleteDocumentConfirmModal').style.display = 'none';
                                                document.body.classList.remove('modal-open');
                                                document.querySelector('.modal-backdrop')?.remove();
                                            }}
                                        ></button>
                                    </div>
                                    <div className="modal-body text-center p-4">
                                        <i className="fas fa-exclamation-triangle text-warning fa-3x mb-3"></i>
                                        <p className="mb-0 fs-5">هل أنت متأكد من رغبتك في حذف هذا المستند؟</p>
                                        <p className="text-muted">لا يمكن التراجع عن هذا الإجراء.</p>
                                    </div>
                                    <div className="modal-footer justify-content-center">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary px-4" 
                                            onClick={() => {
                                                document.getElementById('deleteDocumentConfirmModal').classList.remove('show');
                                                document.getElementById('deleteDocumentConfirmModal').style.display = 'none';
                                                document.body.classList.remove('modal-open');
                                                document.querySelector('.modal-backdrop')?.remove();
                                            }}
                                        >
                                            إلغاء
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-danger px-4" 
                                            id="confirmDeleteDocumentBtn"
                                            onClick={confirmRemoveDocument}
                                        >
                                            <i className="fas fa-trash me-1"></i> حذف
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Toast de confirmation */}
                        {showSuccessToast && (
                            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}>
                                <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                                    <div className="toast-header bg-success text-white">
                                        <i className="fas fa-check-circle me-2"></i>
                                        <strong className="me-auto">تم بنجاح</strong>
                                        <button type="button" className="btn-close btn-close-white" onClick={() => setShowSuccessToast(false)}></button>
                                    </div>
                                    <div className="toast-body d-flex align-items-center">
                                        <i className="fas fa-check-circle text-success me-2 fs-5"></i>
                                        {successMessage}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Modal d'upload de document */}
                        <div className="modal fade" id="documentUploadModal" tabIndex="-1" aria-labelledby="documentUploadModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="documentUploadModalLabel">رفع مستند جديد</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label htmlFor="documentName" className="form-label">اسم المستند <span className="text-danger">*</span></label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="documentName" 
                                                    value={newDocumentName}
                                                    onChange={(e) => setNewDocumentName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="documentFile" className="form-label">الملف <span className="text-danger">*</span></label>
                                                <input 
                                                    type="file" 
                                                    className="form-control" 
                                                    id="documentFile" 
                                                    onChange={(e) => setNewDocumentFile(e.target.files[0])}
                                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                                    required
                                                />
                                                <div className="form-text">الصيغ المقبولة: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (الحد الأقصى: 10MB)</div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
                                        <button 
                                            type="button" 
                                            className="btn btn-primary" 
                                            onClick={handleDocumentUpload}
                                            disabled={!newDocumentFile || !newDocumentName.trim()}
                                        >
                                            <i className="fas fa-upload me-1"></i> رفع المستند
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* CSS pour les styles spécifiques */}
            <style jsx>{`
                .direction_rtl {
                    direction: rtl;
                    text-align: right;
                }
            `}</style>
        </div>
    );
}

export default EditEnchere;