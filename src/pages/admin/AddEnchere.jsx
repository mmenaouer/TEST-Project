import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SlideAdmin from '../../components/SlideAdmin';




function AddEnchere() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    startingPrice: '',
    reservePrice: '',
    incrementAmount: '',
    location: '',
    sellerName: 'أحمد المسؤول',
    termsConditions: '',
    productHistory: '',
    auctionType: 'standard',
    auctionStatus: 'draft'
  });

  // État pour les images
  const [mainImage, setMainImage] = useState("https://www.claudeusercontent.com/api/placeholder/800/450");
  const [imageGallery, setImageGallery] = useState([
    "https://www.claudeusercontent.com/api/placeholder/80/60?text=1",
    "https://www.claudeusercontent.com/api/placeholder/80/60?text=2",
    "https://www.claudeusercontent.com/api/placeholder/80/60?text=3",
    "https://www.claudeusercontent.com/api/placeholder/80/60?text=4"
  ]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // État pour les documents et certificats
  const [documents, setDocuments] = useState({
    docAuthenticationCert: false,
    docOwnershipCert: false,
    docWarranty: false,
    docInspectionReport: false
  });
  
  // État pour les spécifications
  const [specifications, setSpecifications] = useState([
    { property: '', value: '' },
    { property: '', value: '' }
  ]);
  
  // Gestionnaire de changement pour les champs du formulaire
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setDocuments({
        ...documents,
        [id]: checked
      });
    } else if (type === 'radio') {
      setFormData({
        ...formData,
        [e.target.name]: value
      });
    } else {
      setFormData({
        ...formData,
        [id]: value
      });
    }
  };
  
  // Gestionnaire pour les spécifications
  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[index][field] = value;
    setSpecifications(updatedSpecs);
  };
  
  // Ajouter une nouvelle spécification
  const addSpecification = () => {
    setSpecifications([...specifications, { property: '', value: '' }]);
  };
  
  // Supprimer une spécification
  const removeSpecification = (index) => {
    const updatedSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(updatedSpecs);
  };

  // Gestionnaire pour l'envoi du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Combiner toutes les données
    const completeData = {
      ...formData,
      specifications,
      documents,
      images: [mainImage, ...imageGallery]
    };
    
    console.log('Form submitted:', completeData);
    // Redirection vers la page principale après soumission
    navigate('/Backend');
  };

  // Gestionnaire pour changer l'image active
  const handleImageClick = (index) => {
    setActiveImageIndex(index);
    setMainImage(imageGallery[index]);
  };

  // Pour revenir à la page d'accueil
  const goToHome = () => {
    navigate('/Backend');
  };
  
  // Changement d'onglet
  const changeTab = (tabId) => {
    // Simuler un clic sur l'onglet correspondant
    document.getElementById(tabId).click();
  };

  return (
    <>
    
      
      
      
      <div className="container-fluid">
        <div className="row">
          {/* Le sidebar est maintenant dans NavBarAdmin */}
          <SlideAdmin />
          {/* Main Content */}
          <div className="col-lg-10 py-4">
            <div className="container">
              {/* Auction Form Section */}
              <div className="content-wrapper">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="page-title mb-0">إضافة مزاد جديد</h2>
                  <button className="btn btn-outline-secondary" onClick={goToHome}>
                    <i className="fas fa-arrow-right me-1"></i>
                    عودة إلى المزادات
                  </button>
                </div>

                {/* Tabs */}
                <ul className="nav nav-tabs mb-4" id="auctionTabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button 
                      className="nav-link active" 
                      id="info-tab" 
                      data-bs-toggle="tab" 
                      data-bs-target="#info" 
                      type="button" 
                      role="tab" 
                      aria-controls="info" 
                      aria-selected="true"
                    >
                      <i className="fas fa-info-circle me-1"></i>
                      معلومات المزاد
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button 
                      className="nav-link" 
                      id="images-tab" 
                      data-bs-toggle="tab" 
                      data-bs-target="#images" 
                      type="button" 
                      role="tab" 
                      aria-controls="images" 
                      aria-selected="false"
                    >
                      <i className="fas fa-images me-1"></i>
                      الصور
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button 
                      className="nav-link" 
                      id="details-tab" 
                      data-bs-toggle="tab" 
                      data-bs-target="#details" 
                      type="button" 
                      role="tab" 
                      aria-controls="details" 
                      aria-selected="false"
                    >
                      <i className="fas fa-list-alt me-1"></i>
                      التفاصيل والمواصفات
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button 
                      className="nav-link" 
                      id="schedule-tab" 
                      data-bs-toggle="tab" 
                      data-bs-target="#schedule" 
                      type="button" 
                      role="tab" 
                      aria-controls="schedule" 
                      aria-selected="false"
                    >
                      <i className="fas fa-calendar-alt me-1"></i>
                      جدولة المزاد
                    </button>
                  </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content" id="auctionTabsContent">
                  {/* Basic Info Tab */}
                  <div className="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
                    <form>
                      <div className="row mb-3">
                        <div className="col-md-8">
                          <label htmlFor="title" className="form-label required">عنوان المزاد</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="مثال: سيارة مرسيدس كلاسيكية 1965" 
                            required 
                          />
                          <div className="form-text">اكتب عنوانًا واضحًا ومختصرًا (5-15 كلمة)</div>
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="category" className="form-label required">الفئة</label>
                          <select 
                            className="form-select" 
                            id="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                          >
                            <option value="">اختر فئة</option>
                            <option value="cars">سيارات</option>
                            <option value="jewelry">مجوهرات</option>
                            <option value="electronics">إلكترونيات</option>
                            <option value="realestate">عقارات</option>
                            <option value="art">فن</option>
                            <option value="antiques">تحف</option>
                            <option value="furniture">أثاث</option>
                            <option value="other">أخرى</option>
                          </select>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-12">
                          <label htmlFor="description" className="form-label required">وصف المزاد</label>
                          <textarea 
                            className="form-control" 
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5" 
                            placeholder="اكتب وصفًا تفصيليًا للمنتج..." 
                            required
                          ></textarea>
                          <div className="form-text">اذكر معلومات مهمة مثل الحالة والميزات والتاريخ وأي تفاصيل أخرى قد تهم المزايدين</div>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-4">
                          <label htmlFor="startingPrice" className="form-label required">سعر البداية (درهم)</label>
                          <input 
                            type="number" 
                            className="form-control" 
                            id="startingPrice"
                            value={formData.startingPrice}
                            onChange={handleChange}
                            placeholder="مثال: 10000" 
                            min="0" 
                            required 
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="reservePrice" className="form-label">السعر الاحتياطي (درهم)</label>
                          <input 
                            type="number" 
                            className="form-control" 
                            id="reservePrice"
                            value={formData.reservePrice}
                            onChange={handleChange}
                            placeholder="مثال: 15000" 
                            min="0" 
                          />
                          <div className="form-text">السعر الأدنى الذي تقبل به (اختياري)</div>
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="incrementAmount" className="form-label required">الحد الأدنى للزيادة (درهم)</label>
                          <input 
                            type="number" 
                            className="form-control" 
                            id="incrementAmount"
                            value={formData.incrementAmount}
                            onChange={handleChange}
                            placeholder="مثال: 500" 
                            min="0" 
                            required 
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label htmlFor="sellerName" className="form-label required">اسم البائع</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="sellerName"
                            value={formData.sellerName}
                            readOnly 
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="location" className="form-label required">الموقع</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="مثال: الدار البيضاء، المغرب" 
                            required 
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-12">
                          <label htmlFor="termsConditions" className="form-label">شروط وأحكام خاصة</label>
                          <textarea 
                            className="form-control" 
                            id="termsConditions"
                            value={formData.termsConditions}
                            onChange={handleChange}
                            rows="3" 
                            placeholder="أي شروط خاصة بهذا المزاد..."
                          ></textarea>
                          <div className="form-text">اترك هذا الحقل فارغًا لاستخدام الشروط والأحكام العامة للموقع</div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-outline-secondary" disabled>
                          <i className="fas fa-arrow-right me-1"></i>
                          السابق
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-primary" 
                          onClick={() => changeTab('images-tab')}
                        >
                          التالي
                          <i className="fas fa-arrow-left ms-1"></i>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Images Tab */}
                  <div className="tab-pane fade" id="images" role="tabpanel" aria-labelledby="images-tab">
                    <div className="row mb-4">
                      <div className="col-md-8">
                        <h5 className="mb-3">معاينة الصورة الرئيسية</h5>
                        <img 
                          src={mainImage} 
                          id="mainImagePreview" 
                          className="preview-image" 
                          alt="معاينة الصورة الرئيسية" 
                        />
                        
                        <div className="d-flex gap-2 mb-3">
                          {imageGallery.map((img, index) => (
                            <img 
                              key={index}
                              src={img} 
                              className={`image-thumbnail ${activeImageIndex === index ? 'active' : ''}`} 
                              alt={`صورة ${index + 1}`} 
                              onClick={() => handleImageClick(index)}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <h5 className="mb-3">رفع الصور</h5>
                        <div className="upload-box mb-3">
                          <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                          <p className="mb-1">اسحب الصور هنا أو</p>
                          <label htmlFor="imageUpload" className="btn btn-sm btn-outline-primary">اختر الملفات</label>
                          <input type="file" id="imageUpload" className="d-none" multiple accept="image/*" />
                        </div>
                        <div className="alert alert-info" role="alert">
                          <i className="fas fa-info-circle me-1"></i>
                          <small>- يمكنك رفع حتى 10 صور</small><br />
                          <small>- الصيغ المدعومة: JPG, PNG, JPEG</small><br />
                          <small>- الحجم الأقصى: 5 ميجابايت لكل صورة</small>
                        </div>
                      </div>
                    </div>

                    <div className="form-check mb-4">
                      <input className="form-check-input" type="checkbox" id="markMainImage" />
                      <label className="form-check-label" htmlFor="markMainImage">
                        تعيين الصورة الأولى كصورة رئيسية للمزاد
                      </label>
                    </div>

                    <div className="d-flex justify-content-between">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={() => changeTab('info-tab')}
                      >
                        <i className="fas fa-arrow-right me-1"></i>
                        السابق
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={() => changeTab('details-tab')}
                      >
                        التالي
                        <i className="fas fa-arrow-left ms-1"></i>
                      </button>
                    </div>
                  </div>

                  {/* Details Tab */}
                  <div className="tab-pane fade" id="details" role="tabpanel" aria-labelledby="details-tab">
                    <div className="row mb-4">
                      <div className="col-md-12">
                        <h5 className="mb-3">مواصفات المنتج</h5>
                        <p className="text-muted mb-3">أضف المواصفات التفصيلية للمنتج. يمكنك إضافة المزيد من الحقول حسب الحاجة.</p>
                        
                        <div id="specificationsContainer">
                          {specifications.map((spec, index) => (
                            <div className="row mb-2 specification-row" key={index}>
                              <div className="col-md-5">
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  placeholder="اسم الخاصية (مثال: الماركة)"
                                  value={spec.property}
                                  onChange={(e) => handleSpecificationChange(index, 'property', e.target.value)}
                                />
                              </div>
                              <div className="col-md-5">
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  placeholder="القيمة (مثال: مرسيدس)"
                                  value={spec.value}
                                  onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                                />
                              </div>
                              <div className="col-md-2">
                                <button 
                                  type="button" 
                                  className="btn btn-outline-danger w-100"
                                  onClick={() => removeSpecification(index)}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <button 
                          type="button" 
                          className="btn btn-outline-primary mt-2" 
                          onClick={addSpecification}
                        >
                          <i className="fas fa-plus me-1"></i>
                          إضافة خاصية جديدة
                        </button>
                      </div>
                    </div>
                    
                    <div className="row mb-4">
                      <div className="col-md-12">
                        <h5 className="mb-3">تاريخ المنتج</h5>
                        <textarea 
                          className="form-control" 
                          id="productHistory"
                          value={formData.productHistory}
                          onChange={handleChange}
                          rows="4" 
                          placeholder="اكتب نبذة عن تاريخ المنتج، مصدره، ملاكه السابقين، أو أي معلومات تاريخية هامة..."
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="row mb-4">
                      <div className="col-md-12">
                        <h5 className="mb-3">الوثائق والشهادات</h5>
                        <div className="form-check mb-2">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="docAuthenticationCert"
                            checked={documents.docAuthenticationCert}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="docAuthenticationCert">
                            شهادة أصالة
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="docOwnershipCert"
                            checked={documents.docOwnershipCert}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="docOwnershipCert">
                            وثائق الملكية
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="docWarranty"
                            checked={documents.docWarranty}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="docWarranty">
                            الضمان
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="docInspectionReport"
                            checked={documents.docInspectionReport}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="docInspectionReport">
                            تقرير الفحص
                          </label>
                        </div>
                        
                        <div className="upload-box mt-3">
                          <i className="fas fa-file-upload fa-2x text-muted mb-2"></i>
                          <p className="mb-1">رفع وثائق داعمة (اختياري)</p>
                          <label htmlFor="documentUpload" className="btn btn-sm btn-outline-primary">اختر الملفات</label>
                          <input type="file" id="documentUpload" className="d-none" multiple accept=".pdf,.doc,.docx,.jpg,.png" />
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={() => changeTab('images-tab')}
                      >
                        <i className="fas fa-arrow-right me-1"></i>
                        السابق
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={() => changeTab('schedule-tab')}
                      >
                        التالي
                        <i className="fas fa-arrow-left ms-1"></i>
                      </button>
                    </div>
                  </div>

                  {/* Schedule Tab */}
                  <div className="tab-pane fade" id="schedule" role="tabpanel" aria-labelledby="schedule-tab">
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <h5 className="mb-3">نوع المزاد</h5>
                        <div className="form-check mb-3">
                          <input 
                            className="form-check-input" 
                            type="radio" 
                            name="auctionType" 
                            id="typeStandard" 
                            value="standard"
                            checked={formData.auctionType === 'standard'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="typeStandard">
                            <strong>مزاد عادي</strong> - المزايدون يقدمون عروضهم عبر الإنترنت خلال فترة محددة
                          </label>
                        </div>
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="radio" 
                            name="auctionType" 
                            id="typeLive" 
                            value="live"
                            checked={formData.auctionType === 'live'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="typeLive">
                            <strong>مزاد مباشر</strong> - بث مباشر مع مزايدات في الوقت الفعلي
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h5 className="mb-3">حالة المزاد</h5>
                        <div className="form-check mb-3">
                          <input 
                            className="form-check-input" 
                            type="radio" 
                            name="auctionStatus" 
                            id="statusDraft" 
                            value="draft"
                            checked={formData.auctionStatus === 'draft'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="statusDraft">
                            <strong>مسودة</strong> - حفظ كمسودة للنشر لاحقًا
                          </label>
                        </div>
                        <div className="form-check mb-3">
                          <input 
                            className="form-check-input" 
                            type="radio" 
                            name="auctionStatus" 
                            id="statusScheduled" 
                            value="scheduled"
                            checked={formData.auctionStatus === 'scheduled'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="statusScheduled">
                            <strong>مجدول</strong> - نشر تلقائي في الوقت المحدد
                          </label>
                        </div>
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="radio" 
                            name="auctionStatus" 
                            id="statusPublished" 
                            value="published"
                            checked={formData.auctionStatus === 'published'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="statusPublished">
                            <strong>نشر الآن</strong> - نشر المزاد مباشرة بعد الحفظ
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <label htmlFor="startDate" className="form-label required">تاريخ بدء المزاد</label>
                        <input type="date" className="form-control" id="startDate" required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="endDate" className="form-label required">تاريخ انتهاء المزاد</label>
                        <input type="date" className="form-control" id="endDate" required />
                      </div>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <label htmlFor="startTime" className="form-label required">وقت بدء المزاد</label>
                        <input type="time" className="form-control" id="startTime" required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="endTime" className="form-label required">وقت انتهاء المزاد</label>
                        <input type="time" className="form-control" id="endTime" required />
                      </div>
                    </div>

                    <div className="form-check mb-4">
                      <input className="form-check-input" type="checkbox" id="featuredAuction" />
                      <label className="form-check-label" htmlFor="featuredAuction">
                        تمييز المزاد (سيظهر في القسم العلوي من الصفحة الرئيسية)
                      </label>
                    </div>

                    <div className="d-flex justify-content-between">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={() => changeTab('details-tab')}
                      >
                        <i className="fas fa-arrow-right me-1"></i>
                        السابق
                      </button>
                      <div>
                        <button type="button" className="btn btn-outline-secondary me-2">
                          حفظ كمسودة
                        </button>
                        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                          <i className="fas fa-save me-1"></i>
                          حفظ المزاد
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddEnchere;