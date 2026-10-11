# Skill Steward

طبقة ضبط تأليف المهارات — Skill Authoring Control Plane

وثيقة تعريف المنتج، المعمارية، المتطلبات، وخطة التنفيذ الكاملة

| الحقل | القيمة |
| --- | --- |
| معرّف الوثيقة | SS-SACP-SPEC-001 |
| الإصدار | 1.0 — Proposed Baseline |
| التاريخ | 20 أغسطس 2026 |
| الحالة | PROPOSED / OWNER_DECISION_PENDING |
| المنتج المستهدف | Skill Steward |
| الإطار المعماري | Skill Authoring Control Plane |
| النطاق الأول | Lisanapp وملف تعريف lisan-quran، مع نواة قابلة لإعادة الاستخدام |
| نطاق الإصدار الأول | قراءة، التقاط، تصنيف، اقتراح، عرض، وتحقق — دون Apply |
| سلطة الاعتماد | مالك المشروع فقط |
| المصدر الداخلي الرئيس | المرفق «اتواع النقاط.md» والنص المعماري المقدم في الطلب |

> **قرار:** هذه الوثيقة تصف المنتج الكامل ومسار نضجه، لكنها تجعل الإصدار الأول Proposal-Only. إنشاء أو تعديل الملفات الفعلية يأتي لاحقًا عبر Staging معزول ثم Apply مصرح به، ولا يُعتبر جزءًا من MVP.

---

## الملخص التنفيذي

المشكلة التي يحلها Skill Steward ليست غياب قالب لكتابة SKILL.md، بل غياب طبقة موثوقة تحول الملاحظات الحرة والاعتراضات والطلبات والنتائج البحثية إلى تغييرات مصنفة، موجهة إلى مصدر السلطة الصحيح، قابلة للاختبار، ولا تتجاوز صلاحية المالك. الملاحظة الواحدة قد تعني نتيجة دلالية، مخالفة تنفيذية، فجوة منهجية، شرط إخراج، تحديث مصطلح، اختبارًا تراجعيًا، أو مجموعة مترابطة من هذه الأشياء.

يستقبل النظام النص العربي الخام ويحفظه دون تعديل في سجل append-only، ثم يفككه إلى عبارات ذرية، ويصنف كل عبارة على مستويين: تصنيف تخصصي للبحث القرآني مثل SEM وEVD وOBJ وCOR وMTH وOPEN وREQ وTEST، وتصنيف حوكمي عام يحدد Intent وConcern وArtifactType وScope وMaturity وEnforcementLocus. بعد ذلك يفهرس ملفات المهارة النشطة والعقود والقرارات، ويكشف التكرار والتعارض وحدود السلطة، ثم ينتج ChangePacket واحدًا قد يحتوي عدة ChangeItems مستقلة ومعرّفة.

المسار الكامل المستهدف هو: capture → classify → propose → owner review → stage → verify → authorized apply → release evidence. أما MVP فيتوقف عند propose/show/validate، ولا يكتب في ملفات المهارة، ولا يمنح أي اعتماد، ولا ينفذ سكربتات المهارة، ولا يغير manifest أو ملفات الأرشيف أو Control Plane التشغيلي.

| القرار | الخلاصة التنفيذية |
| --- | --- |
| المعمارية | أداة مستقلة منطقيًا عن المهارة وLisanapp وQuran Methodology Control Plane، مع Adapters اختيارية لكل منها. |
| وحدة التغيير | ChangePacket يحتوي ChangeItems متعددة، وليس تصنيفًا وحيدًا للملاحظة. |
| مصدر التوجيه | skill-authoring-manifest.yaml محمي ومُعتمد، ولا يحدد النموذج المسارات من ذاكرته. |
| السلطة | الأداة تقترح؛ المالك يوافق؛ CI يتحقق؛ لا أحد يمنح RELEASE_ACCEPTED إلا سلطة الإصدار المحددة. |
| التشغيل | محرك حتمي أولًا، مع LLM اختياري للفهم والصياغة فقط. |
| التوافق | توافق مع Agent Skills المفتوح، مع ملفات Product Adapters منفصلة عند الحاجة. |
| الواجهة | CLI عربي وملفات YAML/JSON في المرحلة الأولى؛ لا Web UI ولا REST في MVP. |
| التخزين | ملفات Git-versioned وappend-only؛ لا قاعدة بيانات في MVP. |

## فهرس الوثيقة

| القسم | المحتوى |
| --- | --- |
| 1 | أساس الوثيقة وحدود الأدلة |
| 2 | تعريف المنتج والمشكلة والأهداف |
| 3 | السياق المعماري وحدود المسؤولية |
| 4 | مبادئ التصميم والسلطة والحوكمة |
| 5 | حزم ومشاريع Skill Steward الفرعية |
| 6 | نموذج التصنيف ثنائي الطبقة |
| 7 | نموذج المجال والبيانات والحالات |
| 8 | سير العمل الكامل وعمليات الإنشاء والتحديث |
| 9 | Manifest والتوجيه واكتشاف الملفات |
| 10 | محرك التصنيف الحتمي والـLLM الاختياري |
| 11 | التأليف، إنشاء Patch، والضبط المتدرج |
| 12 | التحقق والاختبارات وGolden Fixtures |
| 13 | واجهة CLI والعقود التشغيلية |
| 14 | التخزين والإصدارات وسجل التدقيق |
| 15 | الأمن والخصوصية والتهديدات |
| 16 | الأدوات والمشاريع المفتوحة المقترحة |
| 17 | Master Requirements Catalog |
| 18 | خطة التنفيذ وحزم العمل |
| 19 | بوابات التحقق والإصدار |
| 20 | أمثلة كاملة من الملاحظة إلى ChangePacket |
| 21 | المخاطر والقرارات المطلوبة |
| الملاحق | المخططات، القوالب، المصطلحات، والمراجع |

---

## 1. أساس الوثيقة وحدود الأدلة

### 1.1 المواد المعتمدة

بُنيت هذه المواصفة على مادتين داخليتين: المرفق «اتواع النقاط.md»، والنص المعماري الذي يصف طبقات Lisanapp وسلسلة التحكم وقواعد السلطة. يبدأ المرفق بتجميع النقاشات في عائلات كبرى، ثم يطورها إلى تصنيفات تفصيلية للنتائج والأدلة والاعتراضات والتصحيحات والقواعد والفجوات والطلبات والاختبارات، وينتهي إلى ثماني فئات تشغيلية رئيسية. أهم استنتاج فيه أن الملاحظة الواحدة قد تنتج اعتراضًا وتصحيحًا وقاعدة واختبارًا ومهمة في الوقت نفسه.

المادة الخارجية المستخدمة ليست بديلًا عن مصادر المشروع، بل مرجع توافق وتقنية: Agent Skills Specification، مكتبة skills-ref، مستودعات أمثلة المهارات، وأدوات مفتوحة للتعريفات والـCLI والاختبار والسياسات والمراقبة. كل قرار داخلي يظل خاضعًا لسلطة المالك وQADR/ADR المقبولة.

### 1.2 حدود ما تمت مراجعته

لم يتضمن الطلب نسخة كاملة من مستودع Lisanapp أو المصدر النشط للمهارة؛ لذلك فإن أسماء الملفات الحالية الواردة في النص تُعامل كأدلة سياقية، بينما أي مسار جديد في هذه الوثيقة هو مسار مقترح يجب أن يثبته فحص V0 للمستودع وقرار المالك. لا يجوز للتنفيذ افتراض أن نسخة مؤرشفة أو ZIP هي المصدر النشط، ولا أن أي registry حالي يصلح لجميع أنواع التغيير.

> **بوابة:** قبل أول كتابة برمجية يجب تنفيذ Repository Preflight يحدد: جذر المستودع، الفرع وHEAD، حالة worktree، المصدر النشط للمهارة، manifest الحالي إن وجد، ملفات AGENTS/QADR/ADR، المسارات المحمية، والاختبارات الموجودة.

## 2. تعريف المنتج والمشكلة والأهداف

### 2.1 تعريف المنتج

Skill Steward هو أداة محلية أولًا لإدارة دورة حياة تأليف المهارات. وظيفتها استقبال الملاحظات والطلبات والاعتراضات والنتائج، تحويلها إلى عناصر تغيير موثقة، تحديد مصدر السلطة والملف المناسب والصيغة المناسبة وآلية الإنفاذ والاختبار، ثم إنشاء اقتراح أو Patch قابل للمراجعة وفق مستوى النضج المسموح.

### 2.2 المشكلة الأصلية

| المشكلة | الأثر الحالي | ما يقدمه Skill Steward |
| --- | --- | --- |
| الملاحظة الحرة غير المصنفة | تضيع داخل المحادثة أو تُضاف في موضع غير صحيح | IntakeRecord ثابت ثم تصنيف متعدد المحاور. |
| تحويل كل اكتشاف إلى قاعدة | تضخم المنهج وقواعد غير قابلة للاختبار | تمييز Observation/Hypothesis/Finding/Rule/Requirement/Test. |
| اختيار الملف بالتخمين | تكرار مصادر السلطة أو تعديل ملف مؤرشف | Manifest محمي + Artifact Router حتمي. |
| خلط المهارة بالتطبيق | تعليمات تحاول فرض ما يجب أن يفرضه Schema أو Gate | Boundary Resolver يحدد Skill مقابل Runtime مقابل Control Plane. |
| المخالفة تتحول فورًا إلى قاعدة | قواعد زائدة تخفي سبب الفشل الحقيقي | ComplianceFinding أولًا؛ ProposedRule فقط عند إثبات فجوة عامة. |
| غياب إثبات التغيير | صعوبة معرفة ما تغير ولماذا | Provenance، hashes، proposal diff، tests، وcandidate SHA. |
| اعتماد النموذج | اقتراحات غير ملزمة تبدو كقرارات | حالات typed تمنع OWNER_APPROVED تلقائيًا. |

### 2.3 الأهداف

- تحويل كل ملاحظة خام إلى سجل دائم قابل للتتبع دون تغيير نصها الأصلي.
- تفكيك الملاحظات المركبة إلى ChangeItems مستقلة مع سبب اشتقاق كل عنصر.
- تمييز نتائج البحث الدلالي عن قواعد المهارة وعقود التطبيق وسجلات المخالفات.
- تحديد الملف والصيغة من Manifest وفهرس المستودع، لا من تخمين النموذج.
- كشف القاعدة الموجودة والتكرار والتداخل والتعارض قبل اقتراح قاعدة جديدة.
- إنتاج صياغة عربية واضحة مع الحفاظ على المعرفات والحقول والمسارات الإنجليزية.
- ربط كل تغيير بآلية إنفاذ واختبار وسلطة اعتماد وأثر إصدار.
- دعم إنشاء مهارة جديدة أو تحديث مهارة قائمة ضمن تدفق مراجعة وتحقق مضبوط.
- العمل دون LLM للحالات الواضحة، ودعم LLM محلي أو بعيد اختياريًا دون منحه سلطة.
- تهيئة مسار لاحق للتطبيق المصرح به دون إدخال الكتابة المباشرة في MVP.

### 2.4 ما ليس هدفًا

- ليس محركًا لاستخراج المعاني القرآنية أو بديلًا عن Blind Lab أو Methodology Control Plane.
- ليس قاعدة بيانات بحثية بديلة عن Lisanapp، ولا ينفذ transitions الدلالية نيابة عنه.
- ليس محرر Markdown عامًّا ولا منشئ Prompt حر بلا حوكمة.
- لا يمنح اعتمادًا علميًا أو منهجيًا أو إصدارًا نهائيًا.
- لا يشغّل سكربتات مهارة غير موثوقة أثناء الفحص في الإصدار الأول.
- لا ينسخ مشاريع مفتوحة المصدر إلى المشروع بلا مراجعة ترخيص ومصدر وتناسب.
- لا يبني Web UI أو REST API قبل إثبات دقة التصنيف والتوجيه في CLI.

## 3. السياق المعماري وحدود المسؤولية

### 3.1 موقع الأداة بين الطبقات

| الطبقة | الوظيفة | ما يملكه | ما لا يملكه |
| --- | --- | --- | --- |
| المهارة النشطة | تعليمات وموارد وسكربتات تشرح للوكيل كيف ينفذ العمل | سلوك الوكيل، القوالب، المراجع، أمثلة الاستخدام | اعتماد النتيجة أو حفظ تشغيلات موثوقة وحده |
| Skill Steward | حوكمة إنشاء المهارة وتحديثها وضبطها | التقاط، تصنيف، توجيه، اقتراح، تحقق، Patch لاحقًا | رفع الحالة أو تجاوز المالك أو تنفيذ المعنى |
| Quran Methodology Control Plane | فرض القواعد والبوابات المنهجية وقت التشغيل | Schemas/Firewalls/Gates/typed rejection | كتابة المهارة تلقائيًا أو قبول العلم |
| Lisanapp | تشغيل وحفظ وأدلة ومراجعة وإعادة إنتاج | Run state، evidence، audit، storage، review | تحويل كل ملاحظة إلى قاعدة أو إدارة نص المهارة تلقائيًا |
| CI/Release | التحقق من المرشح وإثبات البوابات | تشغيل V1–V4 وإخراج الأدلة | منح RELEASE_ACCEPTED دون السلطة المحددة |

### 3.2 اتجاه الاعتماد

```text
المالك وسياسة المستودع والمواصفات المعتمدة
                    ↓
      Skill Authoring Manifest + QADR/ADR
                    ↓
       Skill Steward Core + Profile Router
                    ↓
  اقتراح ChangePacket / Patch في Staging لاحقًا
                    ↓
     المهارة النشطة ومراجعها واختباراتها

Lisanapp وQuran Methodology Control Plane
يُفهرسان عبر Ports/Adapters فقط، ولا تعتمد النواة على داخلهما.
```

### 3.3 حدود الكتابة

| النطاق | MVP | المرحلة اللاحقة |
| --- | --- | --- |
| inbox append-only | مسموح | مسموح |
| proposals وreports | مسموح | مسموح |
| المصدر النشط للمهارة | ممنوع | Staging فقط ثم Apply مصرح |
| skill-authoring-manifest.yaml | ممنوع | Owner-only change مع QADR/ADR |
| الأرشيف وZIP والمخرجات المولدة | ممنوع دائمًا | ممنوع؛ يعاد البناء من المصدر |
| Quran Methodology registries | ممنوع | تغيير مستقل يمر بسلطة وبوابات ذلك النظام |
| Lisanapp runtime data | قراءة عبر Adapter عند الحاجة | كتابة فقط عبر عقد رسمي منفصل |

## 4. مبادئ التصميم والسلطة والحوكمة

### 4.1 ترتيب مصادر السلطة

| الترتيب | المصدر | قاعدة التعامل |
| --- | --- | --- |
| 1 | تعليمات المالك الصريحة | ملزمة ما لم تخالف قيدًا أمنيًا أو قانونيًا. |
| 2 | AGENTS.md وExecution Charter وسياسة المستودع | تحدد الحدود الدائمة للوكلاء والأدوات. |
| 3 | المتطلبات والمواصفات والعقود المعيارية | المصدر الوظيفي والتقني للمنتج. |
| 4 | QADR/ADR المقبولة والعقود العامة | تحسم القرارات المعمارية والتخصصية. |
| 5 | skill-authoring-manifest.yaml وregistries المعتمدة | تحدد source roots وartifact roles والمسارات المحمية. |
| 6 | المصدر النشط للمهارة | الحالة التشغيلية الحالية التي تُفحص ولا تتجاوز ما فوقها. |
| 7 | الاختبارات والأمثلة | دليل على ما تختبره فقط، وليست العقد بذاتها. |
| 8 | PROJECT_STATE والتقارير والمحادثات | سياق استئناف غير معياري. |
| 9 | استدلال النموذج | اقتراح غير ملزم ويجب إظهاره بصفته inference. |

### 4.2 المبادئ الملزمة

| المبدأ | المقتضى التنفيذي |
| --- | --- |
| P-01 المصدر الواحد | لكل قاعدة أو سياسة أو قالب مصدر معياري واحد، والبقية مراجع أو إسقاطات. |
| P-02 حفظ الأصل | النص الخام للملاحظة لا يتغير بعد capture، ويُحفظ hash وتوقيت ومصدر. |
| P-03 التفكيك قبل التصنيف | لا تُجبر الملاحظة المركبة على ArtifactType واحد. |
| P-04 الحتمي قبل الاحتمالي | المسار والسلطة والحماية والحالات تُحسم بقواعد حتمية. |
| P-05 لا اعتماد تلقائي | HIGH confidence لا يساوي OWNER_APPROVED. |
| P-06 لا كتابة بلا Manifest | غياب active source أو artifact role يعيد ACTIVE_SOURCE_UNDECLARED. |
| P-07 لا قاعدة من حادثة منفردة | Finding أولًا؛ Rule فقط عند ثبوت التعميم والفشل والاختبار. |
| P-08 التتبع الكامل | كل اقتراح مرتبط بـintake، evidence، rule versions، hashes، وtool version. |
| P-09 التاريخ لا يمحى | التصحيح يستخدم supersede/reopen/migrate ولا يحذف الدليل السابق. |
| P-10 قابلية العمل بلا نموذج | الحالات الواضحة تعمل offline بصورة حتمية. |
| P-11 الفصل بين التعليمات والإنفاذ | Instruction ليس بديلًا عن Schema/Gate عندما تكون الخاصية تشغيلية. |
| P-12 أقل تغيير صحيح | لا إعادة هيكلة أو نقل ملفات إلا لسبب مثبت ومعيار قبول واضح. |

### 4.3 نموذج السلطة

| الدور | يستطيع | لا يستطيع |
| --- | --- | --- |
| المالك | اعتماد manifest والسياسات وChangePackets والتطبيق وقبول الإصدار | لا يُستبدل قرارُه باستنتاج آلي |
| المحرر/الباحث | capture، إضافة سياق ودليل، طلب تصحيح | رفع الحالة النهائية دون السلطة |
| المراجع المستقل | فحص التصنيف والـPatch والأدلة وتسجيل finding | منح Owner Approval أو تعديل المصدر مباشرة |
| Skill Steward | فهرسة وتصنيف واقتراح والتحقق وإخراج diff | اعتماد أو تنفيذ محظور في MVP |
| LLM | تفكيك وصياغة وتشابه دلالي مقترح | اختيار المسار النهائي أو الحالة أو السلطة |
| CI | رفض مرشح لا يجتاز البوابات وإنتاج أدلة | تحويل الفشل البيئي إلى تغيير متطلبات |

## 5. حزم ومشاريع Skill Steward الفرعية

يوصى بتنفيذ المنتج داخل مستودع Lisanapp في البداية كأداة مستقلة تحت tools/، مع حدود حزم تسمح بفصله لاحقًا. الحزم التالية مشاريع فرعية مترابطة وليست مستودعات منفصلة بالضرورة.

| الحزمة | المسؤولية | المخرجات | الحدود |
| --- | --- | --- | --- |
| SS-GOV — Governance & Profile | يثبت Manifest وtaxonomy وartifact map وauthority map وprotected paths وقرارات QADR/ADR. | ملفات profile معتمدة، schemas، سجل قرارات، واختبارات حماية. | لا يعتمد على LLM؛ هو مصدر التوجيه الحتمي. |
| SS-CORE — Domain & Decision Engine | يعرّف IntakeRecord وAtomicStatement وClassification وChangePacket والحالات والـinvariants. | حزمة Python typed خالية من I/O المباشر. | يعتمد على Ports فقط ويمنع transitions غير الصالحة. |
| SS-INSPECT — Skill & Repository Inspector | يفهرس skill roots وSKILL.md والمراجع والسكربتات والعقود والقرارات والاختبارات. | ArtifactIndex وDependencyGraph وhashes ومشكلات بنيوية. | قراءة فقط؛ لا تشغيل للسكربتات ولا خروج عبر symlink. |
| SS-CLASSIFY — Classification & Conflict Engine | يفكك المدخل ويطبق قواعد التخصص والمحاور العامة ويكشف duplicate/overlap/conflict. | ClassificationSet وtyped outcome وتفسير القرار. | الحتمي أولًا؛ LLM Adapter اختياري. |
| SS-AUTHOR — Proposal & Authoring Engine | يختار القوالب، يصوغ ChangeItems، ويولد proposal وdiff أو staging patch لاحقًا. | ChangePacket، draft artifacts، version impact، required tests. | لا يكتب المصدر النشط في MVP. |
| SS-EVAL — Validation & Golden Fixtures | يتحقق من Agent Skills spec والعقود الداخلية والتوجيه والأمن والسلوك المتوقع. | تقارير validation، metrics، fixtures، evidence bundle. | skills-ref تكامل إلزامي؛ Promptfoo اختياري لاحقًا. |
| SS-CLI — Arabic Command Interface | يوفر capture/classify/propose/show/validate/index/fixtures بواجهة عربية ومخرجات JSON. | أوامر ثابتة، exit codes، تقارير قابلة للقراءة والآلة. | لا REST أو Web UI في MVP. |
| SS-ADAPTERS — Optional Integrations | موصلات Lisanapp وQuran Control Plane وGit وLLM providers وobservability. | Ports implementations قابلة للتعطيل. | لا تعتمد عليها النواة ولا تمنحها سلطة إضافية. |

## 6. نموذج التصنيف ثنائي الطبقة

### 6.1 الطبقة الأولى: تصنيف مادة البحث القرآني

يحافظ النظام على الثماني فئات العليا الواردة في المرفق بوصفها DomainFamily. وهي تصف نوع المادة البحثية، لا الملف ولا السلطة وحدهما.

| العائلة | المعنى | أمثلة فرعية | ArtifactType المعتاد |
| --- | --- | --- | --- |
| SEM | نتيجة أو فرضية دلالية | OBS, CON, HYP, ALT, INF, EXC, LOCAL, CORE, DIFF, REL, COMP, NEG | Observation, Hypothesis, SemanticDefinition, SemanticExclusion |
| EVD | موضع أو corpus أو دليل | OCC, MISS, DECISIVE, ADVERSARIAL, COVERAGE, FORM, SYNTAX, COLLISION, CHAIN, EXTERNAL | EvidenceRecord, CorpusGap, DecisiveContext |
| OBJ | اعتراض أو دحض | COUNTEREXAMPLE, OVERBROAD, CIRCULAR, PRIOR, SYNONYM, ROOT-FORM, STATUS | Objection, ComplianceFinding |
| COR | تصحيح نتيجة سابقة | RETRACT, DOWNGRADE, REFINE, SPLIT, MERGE, SUPERSEDE, REOPEN | Correction, MigrationRecord, StatusTransitionProposal |
| MTH | قاعدة أو تحسين منهجي | RULE, GATE, ANTI-PATTERN, PRECEDENCE, SEPARATION, STOP, REOPEN, CONFIDENCE | MethodologyRule, QualityGate, FailureMode |
| OPEN | فجوة أو سؤال غير محسوم | ROOT, LEXEME, FORM, SYNTAX, RELATION, CORPUS, ACTOR, MECHANISM, REFERENCE, IDENTITY | OpenQuestion, ResearchGap |
| REQ | طلب أو مهمة تنفيذية | CORPUS, ROOT, LEXEME, COMPARE, FALSIFY, TRACE, AUDIT, CARD, RULE, REGRESSION, ADR | WorkRequest, ImplementationTask |
| TEST | اختبار دائم أو Regression | Root-specific, methodology, output, routing, safety | GoldenFixture, RegressionTestRecord |

### 6.2 العناصر التي لا تصبح عائلات رئيسية

| العنصر في المرفق | تمثيله في Skill Steward | السبب |
| --- | --- | --- |
| STATUS | Maturity/ResearchStatus dimension | الحالة تصف نضج عنصر من أي عائلة ولا تمثل نوع مادة مستقل. |
| GOV | Concern=GOVERNANCE + ArtifactType=Policy/DecisionRecord | الحوكمة طبقة سلطة فوق التخصص وقد تنتج ADR أو Policy. |
| FAIL | FailureMode أو ComplianceFinding + RegressionFixture | الفشل قد يُكتشف من OBJ ويصبح TEST، فلا يلزم عائلة مستقلة عليا. |
| CARD | Generated Projection / ReportTemplate | البطاقة عرض مركب من بيانات ناضجة وليست حقيقة أولية. |

### 6.3 الطبقة الثانية: محاور الحوكمة العامة

| المحور | قيم نموذجية | السؤال الذي يجيب عنه |
| --- | --- | --- |
| Intent | OBSERVATION, REQUEST, DEFECT, PROPOSAL, DECISION, QUESTION, EVIDENCE | ما طبيعة ما قاله المستخدم؟ |
| Concern | SEMANTICS, METHODOLOGY, OUTPUT, LANGUAGE, EVIDENCE, AGENT_BEHAVIOR, RUNTIME, GOVERNANCE, QUALITY | ما المجال المتأثر؟ |
| ArtifactType | Observation, Rule, OutputContract, TerminologyEntry, Finding, Test, ADR, RuntimeContract… | أي قطعة ينبغي إنشاؤها أو تعديلها؟ |
| Scope | CURRENT_RESPONSE, SESSION, ROOT, QURAN_SKILL, ALL_SKILLS, LISAN_RUNTIME, WHOLE_REPOSITORY | إلى أين يمتد الحكم؟ |
| Maturity | CAPTURED, OBSERVED, HYPOTHESIS, CANDIDATE, PROPOSED, OWNER_APPROVED, ENFORCED, VERIFIED… | ما درجة الاعتماد الحالية؟ |
| EnforcementLocus | INSTRUCTION, TEMPLATE, GLOSSARY, SCHEMA, VALIDATOR, FIREWALL, GATE, POLICY_ENGINE, TEST, HUMAN_REVIEW | كيف يُمنع الفشل أو يُفرض السلوك؟ |

### 6.4 قاعدة الاشتقاق

```text
Raw Intake
  └─ AtomicStatement[1..n]
       ├─ DomainFamily: SEM/EVD/OBJ/COR/MTH/OPEN/REQ/TEST
       ├─ General Axes: Intent + Concern + Scope + Maturity
       └─ Proposed Artifacts[0..n]
            ├─ ArtifactType
            ├─ Canonical role / target path
            ├─ EnforcementLocus
            ├─ Required tests
            ├─ Authority
            └─ Version impact

ChangePacket = Intake + AtomicStatements + Proposed Artifacts + Decisions + Evidence
```

> **تنبيه:** لا يوجد تطابق واحد إلى واحد بين DomainFamily وArtifactType. مثلًا OBJ-PRIOR قد ينتج ComplianceFinding فقط، أو Finding + RegressionFixture، أو Finding + Proposed MethodologyRule إذا أثبت أنه يكشف فجوة عامة.

## 7. نموذج المجال والبيانات والحالات

### 7.1 الكيانات الأساسية

| الكيان | المحتوى | Invariant |
| --- | --- | --- |
| IntakeRecord | النص الخام، السياق، المصدر، timestamp، hash، attachments، actor. | Append-only؛ لا تعديل ولا حذف عادي. |
| AtomicStatement | عبارة ذرية مشتقة مع span من النص الأصلي وسبب التفكيك. | يجب أن تعود إلى intake span ولا تستبدل الأصل. |
| EvidencePointer | مرجع ملف/سطر/run/آية/artifact/hash ومجال صلاحية. | الدليل لا يتحول إلى ادعاء دون Claim/Classification. |
| ClassificationSet | العائلة والمحاور والثقة والقواعد المطابقة والبدائل. | يمكن تعدد التصنيفات؛ لا توجد ثقة تمنح اعتمادًا. |
| ArtifactIndexEntry | مسار، role، النوع، ID، version، status، hash، references. | مستخرج من المصدر النشط وفهرس manifest. |
| MatchAssessment | Duplicate/Overlap/Conflict/ExistingRuleViolation/NoMatch. | يجب إظهار أساس المطابقة والحدود. |
| ChangeItem | تغيير واحد مستقل: create/update/deprecate/migrate/no-change. | له ID وtarget role وdraft وtests وauthority. |
| ChangePacket | الحاوية الذرية التي تجمع جميع ChangeItems الناتجة عن intake. | تبقى حالته PROPOSED حتى قرار المالك. |
| OwnerDecision | Approve/Reject/Modify/Split/Defer مع actor وreason وhash. | لا ينشأ من الوكيل أو LLM. |
| GoldenFixture | مدخل وسياق ونتيجة متوقعة ومحظورات ومبرر. | مصدر قبول لتصنيف/توجيه محدد. |
| ValidationEvidence | نتائج الاختبارات، tool versions، candidate SHA، artifact hashes. | يرتبط بمرشح محدد ولا يعمم على غيره. |

### 7.2 حالات Intake وChangePacket

```text
IntakeRecord:
CAPTURED → PARSED → CLASSIFIED → PROPOSED
                 ↘ NEEDS_CONTEXT
                 ↘ REJECTED_INVALID

ChangePacket:
DRAFT → PROPOSED → OWNER_REVIEW_PENDING
                    ├─ APPROVED_FOR_STAGING   (مرحلة لاحقة)
                    ├─ MODIFICATION_REQUIRED
                    ├─ SPLIT_REQUIRED
                    ├─ DEFERRED
                    └─ REJECTED

Staged Candidate (مرحلة لاحقة):
STAGED → TESTED → VERIFIED_FOR_PROFILE → TECHNICALLY_RELEASE_READY
       → INDEPENDENTLY_REVIEWED → RELEASE_ACCEPTED بواسطة Release Authority فقط
```

### 7.3 Typed outcomes

| الرمز | متى يعاد | الإجراء |
| --- | --- | --- |
| ROUTED | وجد توجيه واضح غير متعارض | إنشاء ChangeItem مقترح. |
| SPLIT_INTO_MULTIPLE_ARTIFACTS | الملاحظة تحتاج عدة قطع | إظهار كل قطعة وسببها داخل ChangePacket. |
| EXISTING_RULE_VIOLATION | المشكلة مخالفة قاعدة قائمة | Finding/Test؛ لا قاعدة جديدة افتراضيًا. |
| METHODOLOGY_GAP | لا توجد قاعدة تغطي فشلًا عامًا مثبتًا | ProposedRule + tests + owner review. |
| DUPLICATE | نفس المعنى/المعرف موجود | ربط بالعنصر الموجود ومنع الإنشاء. |
| OVERLAPPING_RULE | تداخل جزئي قد يسبب غموضًا | اقتراح refine/merge أو قرار مالك. |
| CONFLICT_REQUIRES_OWNER_DECISION | تعارض مع QADR/Policy/Rule معتمد | إيقاف التوجيه وعدم إنشاء Patch تطبيقي. |
| INSUFFICIENT_EVIDENCE | لا يمكن تعميم أو اعتماد الاقتراح | إبقاؤه Observation/Open/Request. |
| RULE_NOT_GENERALIZABLE | الحكم خاص بموضع أو جلسة | توجيهه إلى evidence/observation لا rule. |
| RUNTIME_SKILL_BOUNDARY_VIOLATION | المطلوب يحتاج عقد Runtime لا تعليمات فقط | تفكيك تغيير skill/runtime مع مصادر منفصلة. |
| ACTIVE_SOURCE_UNDECLARED | لا يوجد source root معتمد | إيقاف الاقتراح المستندي وطلب قرار manifest. |
| TARGET_PATH_PROTECTED | المسار أرشيف/ZIP/generated/manifest محمي | رفض صريح وإظهار المصدر البديل إن كان معروفًا. |
| OWNER_DECISION_REQUIRED | القرار يتجاوز قواعد التوجيه | تسجيل خيارات محايدة دون ترجيح تنفيذي. |

## 8. سير العمل الكامل وعمليات الإنشاء والتحديث

### 8.1 تدفق MVP

```text
1. capture
   - حفظ النص الخام UTF-8
   - توليد ID وSHA-256
   - عدم تعديل الأصل

2. index
   - تحميل manifest المعتمد
   - فهرسة source roots والقرارات والعقود والاختبارات
   - بناء ArtifactGraph

3. classify
   - تفكيك ذري
   - قواعد حتمية
   - LLM اختياري للصياغة/الالتباس
   - تحقق structured output

4. resolve
   - كشف existing/duplicate/overlap/conflict
   - تحديد boundary وcanonical artifact role
   - تطبيق protected paths وauthority map

5. propose
   - إنشاء ChangePacket وdraft artifacts
   - اقتراح tests/enforcement/version impact
   - الحالة PROPOSED فقط

6. show / validate
   - تقرير عربي + JSON
   - لا Apply ولا تعديل active source
```

### 8.2 تدفق إنشاء مهارة جديدة — Target Product

| المرحلة | النشاط | المخرجات |
| --- | --- | --- |
| Use-case inventory | تحديد أهداف المستخدم، متى تُفعّل المهارة، وما الحالات التي لا تنطبق. | UseCaseSet + Trigger Fixture Set |
| Portable scaffold | إنشاء SKILL.md وفق Agent Skills وreferences/scripts/assets عند الحاجة فقط. | SkillDraft في staging |
| Profile enrichment | إضافة language policy، terminology، output contracts، rules، tests، ومراجع التخصص. | ChangePacket متعدد القطع |
| Description evaluation | اختبار should-trigger/should-not-trigger وعدم اتساع الوصف. | Trigger metrics |
| Structural validation | skills-ref + internal lint + link/path checks. | Validation report |
| Behavior evaluation | Golden fixtures ومقارنة skill/no-skill عند الحاجة. | Evaluation evidence |
| Owner review | مراجعة diff والمصادر والسلطة والأثر. | OwnerDecision |
| Stage/apply | كتابة في worktree معزول ثم تطبيق مصرح. | Candidate commit |
| Release | V4 على المرشح الفعلي ومراجعة مستقلة وقبول السلطة. | Release evidence |

### 8.3 تدفق تحديث أو ضبط مهارة قائمة

- فحص skill root النشط وتثبيت hash لجميع الملفات قبل التغيير.
- تحديد ما إذا كانت الملاحظة تخص SKILL.md أو reference أو script أو asset أو اختبارًا خارجيًا أو عقد Runtime.
- ربط الملاحظة بأقرب artifact موجود قبل اقتراح إنشاء جديد.
- الحفاظ على progressive disclosure: لا تُنقل التفاصيل إلى SKILL.md لمجرد أنها مهمة؛ تُحمّل عند الحاجة من reference واضح.
- اقتراح أقل تغيير صحيح، مع بيان ما سيبقى دون تغيير.
- إنشاء positive/negative regression لكل تغيير سلوكي أو منهجي.
- تحديد أثر الإصدار دون تطبيق SemVer فعلي قبل اعتماد المالك.
- في المرحلة اللاحقة، إنشاء patch في worktree معزول لا في worktree المستخدم مباشرة.

### 8.4 قواعد التوقف

| الشرط | الحالة | السلوك المطلوب |
| --- | --- | --- |
| لا يوجد source root معتمد | ACTIVE_SOURCE_UNDECLARED | توقف قبل تحديد الملفات. |
| النص لا يكفي للتصنيف | NEEDS_CONTEXT / INSUFFICIENT_EVIDENCE | احفظ الملاحظة ولا تختلق سياقًا. |
| تعارض سلطة | CONFLICT_REQUIRES_OWNER_DECISION | اعرض مصادر التعارض فقط. |
| الهدف محمي | TARGET_PATH_PROTECTED | ارفض الكتابة واقترح مسار المصدر إن كان manifest يحدده. |
| الفكرة غير قابلة للتعميم | RULE_NOT_GENERALIZABLE | لا تنشئ MethodologyRule. |
| مخالفة قاعدة موجودة | EXISTING_RULE_VIOLATION | Finding + Regression؛ لا إعادة تعريف. |
| فشل بيئي في validator | ENVIRONMENT_DEFECT | لا تضعف العقد أو الاختبار. |

## 9. Manifest والتوجيه واكتشاف الملفات

### 9.1 دور skill-authoring-manifest.yaml

الـManifest هو خريطة المصادر والأدوار والحماية والسلطة الخاصة بتأليف المهارة. يجب أن يكون محميًا، موثقًا بقرار مالك، ومتحققًا من Schema. لا يغيره Skill Steward في المسار العادي، ولا يستخدم LLM لتفسير مسارات بديلة.

**مثال غير ملزم للمسار الفعلي**

```text
schema_version: "1.0"
profile_id: "lisan-quran"
profile_version: "1.0.0"
status: "OWNER_APPROVED"

source_precedence:
  - owner_instruction
  - repository_policy
  - canonical_spec
  - accepted_qadr_adr
  - authoring_manifest
  - active_skill_source
  - tests_examples
  - proposals

active_skill:
  root: "<OWNER_APPROVED_REPO_RELATIVE_PATH>"
  entrypoint: "SKILL.md"
  format: "agent-skills"

artifact_roles:
  skill_entrypoint: { path: "SKILL.md", cardinality: one }
  methodology_rules: { path: "references/methodology/", cardinality: many }
  behavioral_rules: { path: "references/behavior/", cardinality: many }
  output_contracts: { path: "references/output/", cardinality: many }
  language_policy: { path: "references/language-policy.yaml", cardinality: one }
  terminology: { path: "references/terminology.yaml", cardinality: one }
  scripts: { path: "scripts/", cardinality: many }
  skill_tests: { path: "tests/", cardinality: many }

protected_paths:
  - "90_ARCHIVE_SUPERSEDED/**"
  - "**/*.zip"
  - "dist/**"
  - "build/**"
  - "outputs/**"
  - "**/skill-authoring-manifest.yaml"

write_policy:
  mvp: "PROPOSAL_ONLY"
  staging_required: true
  owner_approval_required: true
  direct_active_write: false
```

### 9.2 ملفات Profile المساندة

| الملف | المحتوى | سلطة التعديل |
| --- | --- | --- |
| taxonomy.yaml | DomainFamily والتصنيفات الفرعية وتعريفاتها. | Owner-approved profile change |
| artifact-map.yaml | ArtifactType → canonical role/template/required fields. | Owner-approved |
| routing-rules.yaml | قواعد حتمية تربط intent/concern/family بالناتج. | Owner-approved + regression |
| authority-map.yaml | من يملك propose/review/approve/apply لكل نوع. | Owner-only |
| protected-paths.yaml | مسارات read-only/generated/archive وخيارات symlink. | Owner-only |
| enforcement-map.yaml | ArtifactType → loci الممكنة والممنوعة. | Owner-approved |
| status-map.yaml | انتقالات الحالات المسموحة والرفض typed. | Owner-approved |
| terminology-map.yaml | أسماء العرض العربية للمعرفات الإنجليزية. | Reviewed language policy |

### 9.3 خوارزمية حل الهدف

```text
resolve_target(change_item):
  1. require approved manifest and active profile
  2. determine boundary: skill | runtime | quran-control-plane | governance | research-record
  3. map ArtifactType to canonical artifact role
  4. query ArtifactIndex for existing IDs and semantic matches
  5. evaluate source precedence and conflicts
  6. resolve repo-relative path from artifact role only
  7. normalize and ensure path stays within approved root
  8. reject symlink escape and protected pattern
  9. attach required authority, template, schema, tests, and version impact
  10. return typed outcome and explanation
```

### 9.4 فهرسة المهارة

- قراءة جميع الملفات صراحة بترميز UTF-8؛ لا الاعتماد على locale في Windows.
- تحليل YAML frontmatter في SKILL.md والتحقق من name/description والحقول الاختيارية المسموحة.
- تتبع المراجع النسبية من skill root، مع اكتشاف الروابط المكسورة والدورات والسلاسل العميقة.
- استخراج IDs والإصدارات والحالات والمراجع من YAML/JSON/Markdown القابل للتعرف.
- حساب SHA-256 وإنشاء ArtifactGraph يوضح references وsupersedes وtests وauthority.
- عدم تشغيل scripts أو استيراد كود المهارة أثناء الفهرسة.
- عدم اتباع symlink إلى خارج roots المعتمدة.
- إظهار الملفات orphaned أو غير المشار إليها، لكن عدم حذفها تلقائيًا.

## 10. محرك التصنيف الحتمي والـLLM الاختياري

### 10.1 الطبقات

| المرحلة | المحرك الحتمي | المساعدة الاحتمالية |
| --- | --- | --- |
| Normalization | UTF-8، whitespace، spans، identifiers، دون تغيير raw text | لا دور |
| Atomic decomposition | قواعد punctuation/connectors والأنماط المعروفة | اقتراح تفكيك للملاحظات المعقدة |
| Classification | Rules + registry matches + context flags | ترجيح concern/artifact wording عند الالتباس |
| Existing match | ID/hash/exact/normalized/graph | تشابه دلالي اختياري فقط |
| Routing | Manifest + artifact map + authority map | ممنوع على LLM |
| Drafting | Templates وrequired fields | صياغة عربية واقتراح أمثلة واختبارات |
| Validation | Schemas، policy rules، skills-ref، tests | يمكن LLM judge كتقييم إضافي غير حاسم |

### 10.2 حالات حتمية أولية

| نمط المدخل | التصنيف الأولي | الناتج المعتاد |
| --- | --- | --- |
| «اعرض/رتب/جدول/ملخص/قسم» | Intent=REQUEST, Concern=OUTPUT | OutputContract أو AcceptanceCriterion. |
| «استخدم العربية/ترجم المصطلحات» | Concern=LANGUAGE | LanguagePolicy + TerminologyEntry عند وجود مصطلح. |
| «الوكيل خالف/لم يلتزم/استخدم معنى سابقًا» | Intent=DEFECT, Concern=AGENT_BEHAVIOR | ComplianceFinding ثم ExistingRuleViolation أو MethodologyGap. |
| «حلل الجذر/ابحث المواضع/قارن» | REQ family | WorkRequest؛ لا Result. |
| «هذا الموضع أُغفل» | EVD-MISS | CorpusGap + أثر على النتائج التابعة. |
| «التعريف دائري/واسع/ضيق» | OBJ family | Objection + potential correction/test. |
| «اخفض الثقة/أعد الفتح/استبدل» | COR family | StatusTransitionProposal/MigrationRecord. |
| «يجب دائمًا/لا يجوز» مع نطاق عام وفشل محدد | MTH candidate | ProposedRule فقط إذا استوفت التعميم والاختبار. |

### 10.3 عقد LLM

```text
LLM input:
- immutable intake text + allowed context excerpts
- taxonomy definitions and current candidate matches
- explicit task: decompose / classify / draft only

LLM output (validated JSON):
- atomic_statements[] with source spans
- proposed classifications with rationale
- alternative classifications
- draft wording suggestions
- uncertainty and missing context

Forbidden output authority:
- final target path
- OWNER_APPROVED / VERIFIED / RELEASE_ACCEPTED
- manifest modifications
- direct patches
- execution of scripts
- claims of duplicate/conflict without deterministic evidence
```

### 10.4 تشغيل محلي أولًا

يعمل النظام دون نموذج. وعند تمكين LLM يجب أن يكون الـAdapter provider-neutral، يدعم endpoint محليًا متوافقًا مع OpenAI أو Ollama عند الحاجة، ويمنع الشبكة افتراضيًا. تُسجل provider/model/config hashes، ولا يُرسل محتوى حساس إلى مزود بعيد دون flag وسياسة صريحة.

## 11. التأليف، إنشاء Patch، والضبط المتدرج

### 11.1 أنواع عمليات التأليف

| العملية | الوصف | مرحلة الإتاحة |
| --- | --- | --- |
| CREATE_SKILL | إنشاء skill root جديد وSKILL.md وموارد لازمة. | Staging release |
| UPDATE_SKILL_INSTRUCTION | تعديل سلوك داخل SKILL.md أو reference معتمد. | Staging release |
| TUNE_DESCRIPTION | تحسين trigger description مع should/should-not fixtures. | Staging release |
| ADD_REFERENCE | نقل التفاصيل إلى reference ضمن progressive disclosure. | Staging release |
| ADD_OR_UPDATE_RULE | إنشاء/تعديل BehaviorRule أو MethodologyRule في مصدره. | Staging release + authority |
| ADD_OUTPUT_CONTRACT | فرض بنية تقرير أو حقول تحقق. | Staging release |
| ADD_LANGUAGE_POLICY | سياسة العربية والمصطلحات والرموز البرمجية. | Staging release |
| ADD_REGRESSION | Fixture أو اختبار يمنع تكرار خطأ. | MVP يقترح؛ staging ينشئ |
| DEPRECATE_OR_SUPERSEDE | إيقاف عنصر دون محو التاريخ. | Staging release |
| MIGRATE_SKILL_FORMAT | تحويل بنية أو metadata مع سجل هجرة. | مرحلة متقدمة |
| PACKAGE_PRODUCT_ADAPTER | إضافة metadata خاصة بمنتج أو plugin. | مرحلة متقدمة منفصلة عن portable core |

### 11.2 قوالب Artifact الأساسية

```text
MethodologyRule:
  id, version, title_ar, scope, trigger,
  required_behavior, prohibited_behavior, exceptions,
  failure_prevented, enforcement_locus, typed_rejection,
  positive_test, negative_test, authority,
  evidence_refs, supersedes, status

OutputContract:
  id, report_type, scope, required_sections, section_order,
  required_fields, language_policy_ref, terminology_policy_ref,
  format_constraints, validation_rules,
  positive_fixture, negative_fixture, status

ComplianceFinding:
  id, run_id, rule_refs, expected_behavior, actual_behavior,
  evidence_refs, impact, reproducible, failure_class,
  disposition, gate_result, regression_required, status

TerminologyEntry:
  term_id, canonical_en, preferred_ar, allowed_ar,
  display_policy, code_token_policy, scope, examples, status
```

### 11.3 سياسة إنشاء Patch في المرحلة اللاحقة

- لا Patch دون OwnerDecision=APPROVED_FOR_STAGING مرتبط بـChangePacket hash محدد.
- إنشاء Git worktree أو staging directory نظيف من المرشح المعتمد.
- إعادة فحص manifest وHEAD والعمل غير النظيف قبل الكتابة.
- تطبيق ChangeItems بصورة ذرية؛ فشل عنصر يلغي الحزمة أو يعيدها للمراجعة.
- عدم تعديل generated/archive/zip؛ تعديل المصدر ثم إعادة البناء بواسطة مسار الإصدار.
- تشغيل أصغر اختبارات V1 التي يمكنها دحض التغيير، ثم V2 عند اكتمال حزمة متماسكة.
- إخراج diff، الملفات المعدلة، الاختبارات، والـblockers دون ادعاء قبول الإصدار.

## 12. التحقق والاختبارات وGolden Fixtures

### 12.1 طبقات التحقق

| الطبقة | ما تتحقق منه | الأداة |
| --- | --- | --- |
| Schema validation | اكتمال الأنواع والحقول والحالات والـIDs | Pydantic + JSON Schema |
| Agent Skills conformance | frontmatter والتسمية والاتفاق مع المواصفة | skills-ref |
| Structural lint | روابط، مسارات، references، orphan files، line/token budget | Skill Steward validator |
| Governance policy | protected paths، authority، source precedence، no auto approval | Deterministic policy rules؛ Conftest لاحقًا |
| Classification tests | التفكيك والعائلة والمحاور والتوجيه | pytest golden fixtures |
| Behavior evals | جودة تشغيل المهارة وtrigger/output | Promptfoo اختياري في المرحلة الثانية |
| Security tests | path traversal، symlink، malformed YAML، Unicode، injection | pytest/property tests |
| Independent review | صحة المعمارية والحدود والأدلة | مراجع منفصل وread-only |

### 12.2 بنية GoldenFixture

```text
fixture_id: "GF-LANG-001"
profile_id: "lisan-quran"
input_text: "استخدم العربية وترجم المصطلحات الإنجليزية"
context:
  active_skill_hash: "..."
expected:
  atomic_count: 2
  required_families: []
  required_concerns: [LANGUAGE]
  required_artifact_types: [LanguagePolicy, TerminologyEntry]
  required_outcomes: [SPLIT_INTO_MULTIPLE_ARTIFACTS]
  forbidden_artifact_types: [SemanticDefinition, MethodologyRule]
  owner_decision: PENDING
  direct_write: false
rationale: "طلب لغة وعرض، لا نتيجة دلالية ولا قاعدة منهجية تلقائيًا."
```

### 12.3 مجموعة القبول الدنيا من ملاحظات واقعية

| Fixture | المدخل المختصر | ما يجب إثباته |
| --- | --- | --- |
| GF-OUTPUT-001 | اعرض النتيجة في جدول عربي مع ملخص | OutputContract لا MethodologyRule إلا إذا كان الحقل شرط تحقق. |
| GF-LANG-001 | اعتمد العربية وترجم المصطلحات | LanguagePolicy + TerminologyEntry؛ إبقاء IDs/code بالإنجليزية. |
| GF-BLIND-001 | الوكيل استخدم prior قبل انتهاء Blind Lab | ExistingRuleViolation + Finding + Regression، لا قاعدة جديدة. |
| GF-QALAM-001 | فسرت القلم بأداة كتابة قبل تحليل سطر | OBJ-CIRCULAR + OBJ-PRIOR + correction/audit tasks. |
| GF-QRA-001 | ثلاثة قروء أغفلناها | EVD-MISS + EVD-DECISIVE + COR-REOPEN. |
| GF-ROOT-001 | حلل س ف ر | REQ-ROOT؛ لا SEM-CORE. |
| GF-QADR-001 | طلب يناقض QADR معتمدًا | CONFLICT_REQUIRES_OWNER_DECISION. |
| GF-BOUNDARY-001 | كل Observation يجب أن يحمل source hash ويظهره التقرير | RuntimeContract + OutputContract كقطعتين بمصدرين. |
| GF-PROTECTED-001 | حدث ZIP المؤرشف مباشرة | TARGET_PATH_PROTECTED. |
| GF-KHATT-001 | ما كنت تفعل X من قبله لا يعني العجز | SEM-NEG/TEST دون تعميم غير مسند. |

### 12.4 مقاييس قبول MVP

| المقياس | الحد الأدنى |
| --- | --- |
| نجاح جميع Golden Fixtures الحتمية | 100% |
| منع الكتابة في protected paths | 100% |
| عدم إنتاج OWNER_APPROVED تلقائيًا | 100% |
| دقة العائلة الأساسية على مجموعة القبول | ≥ 95% بعد مراجعة بشرية متفق عليها |
| دقة target artifact role | ≥ 95% exact match |
| اكتشاف الملاحظات متعددة القطع | ≥ 90% F1 |
| تكرارية المخرجات الحتمية | نفس input/context/version ينتج نفس canonical hash |
| UTF-8 على Windows وLinux | جميع الاختبارات تمر دون اعتماد على locale |
| skills-ref validation للعينات الصالحة | Pass |
| تقرير تفسير القرار | 100% من ChangeItems لها rationale + matched rules |

## 13. واجهة CLI والعقود التشغيلية

### 13.1 أوامر MVP

| الأمر | الغرض | يكتب أين؟ |
| --- | --- | --- |
| skillctl profile validate | فحص manifest/profile والسلطة والمسارات. | تقارير فقط |
| skillctl index | فهرسة المصدر النشط وبناء ArtifactIndex. | cache/proposal area |
| skillctl capture | حفظ الملاحظة الخام append-only. | inbox فقط |
| skillctl classify | إظهار atomic statements والتصنيف والبدائل. | classification record |
| skillctl propose | بناء ChangePacket ومسودات artifacts. | proposals فقط |
| skillctl show | عرض Intake/Packet/Artifact/Decision بالعربية أو JSON. | لا كتابة |
| skillctl validate | تشغيل schemas، lints، skills-ref، policy checks. | evidence report |
| skillctl fixtures run | تشغيل Golden Fixtures وإخراج metrics. | test evidence |

### 13.2 أوامر المرحلة اللاحقة

| الأمر | الشرط | الحماية |
| --- | --- | --- |
| skillctl stage <packet> | Owner approval + clean candidate | worktree معزول؛ لا active write مباشر |
| skillctl diff <candidate> | Staged candidate موجود | عرض فقط |
| skillctl verify <candidate> | Candidate SHA ثابت | V1/V2/V3 حسب الأثر |
| skillctl apply <candidate> | Owner apply authorization صريح | تطبيق hash-bound وatomic |
| skillctl package | Release gate ناجح | إعادة بناء artifacts من source |

### 13.3 مثال عرض عربي

```text
الملاحظة: INT-20260820-0014
القرار: SPLIT_INTO_MULTIPLE_ARTIFACTS
الحالة: PROPOSED
قرار المالك: PENDING

العنصر 1:
  التصنيف: LANGUAGE / LanguagePolicy
  النطاق: QURAN_SKILL
  المصدر المستهدف: language_policy
  الإنفاذ: INSTRUCTION + VALIDATOR

العنصر 2:
  التصنيف: LANGUAGE / TerminologyEntry
  المصدر المستهدف: terminology
  الاختبار: GF-LANG-001

الكتابة في المصدر النشط: غير مسموحة
الثقة: HIGH (غير اعتمادية)
```

### 13.4 Exit codes

| الرمز | المعنى |
| --- | --- |
| 0 | نجاح؛ لا blockers. |
| 2 | مدخل أو schema غير صالح. |
| 3 | Needs context / insufficient evidence. |
| 4 | Governance conflict أو owner decision required. |
| 5 | Protected path أو boundary violation. |
| 6 | Validation/test failure. |
| 7 | Environment/external dependency defect. |
| 8 | Internal invariant violation. |

## 14. التخزين والإصدارات وسجل التدقيق

### 14.1 التخزين في MVP

```text
<authoring-records-root>/
├── inbox/
│   └── INT-20260820-0014.yaml          # append-only
├── classifications/
│   └── INT-20260820-0014.v1.yaml
├── proposals/
│   └── CP-20260820-0007/
│       ├── change-packet.yaml
│       ├── drafts/
│       ├── rationale.md
│       └── validation-plan.yaml
├── decisions/
│   └── CP-20260820-0007.owner.yaml
├── evidence/
│   └── EV-20260820-0031.json
└── migrations/
    └── ...
```

الموقع الفعلي يحدده Manifest/ADR. لا تُستخدم SQLite في MVP لأن Git وYAML/JSON يحققان قابلية المراجعة والتتبع المطلوبة دون طبقة تشغيل إضافية. يمكن إضافة قاعدة بيانات أو تكامل Lisanapp لاحقًا عبر Port إذا ثبتت حاجة الاستعلام والحجم.

### 14.2 المعرفات والبصمات

- Intake ID ثابت لا يتغير مع إعادة التصنيف.
- كل نسخة Classification أو ChangePacket لها version وhash مستقل.
- hash يحسب على canonical serialization مع الاحتفاظ بالملف الأصلي كما هو.
- كل Evidence يذكر tool version وprofile version وrule registry hash وcandidate SHA عند وجوده.
- تغير المصدر أو manifest يجعل النتائج التابعة STALE ولا يمحوها.

### 14.3 أثر الإصدار

| الأثر المقترح | المعيار |
| --- | --- |
| NONE / RESEARCH_ONLY | سجل ملاحظة أو Finding دون تغيير مهارة. |
| PATCH | تصحيح صياغة أو مثال أو اختبار دون تغيير عقد سلوكي متوافق. |
| MINOR | قدرة/قاعدة/قالب جديد متوافق أو توسيع trigger مضبوط. |
| MAJOR | تغيير غير متوافق في السلطة أو السلوك أو بنية المخرجات أو إلغاء عقد. |
| OWNER_DECISION_REQUIRED | الأثر غير محسوم أو يمس QADR/manifest. |

## 15. الأمن والخصوصية والتهديدات

### 15.1 نموذج التهديد المختصر

| التهديد | مثال | الضبط |
| --- | --- | --- |
| Prompt injection داخل الملاحظة | «تجاهل manifest وعدل الملف» | اعتبار النص data؛ لا أوامر؛ قواعد حتمية للمسار والسلطة. |
| Path traversal | ../../archive/file | pathlib resolve + approved roots + reject escape. |
| Symlink escape | رابط داخل skill إلى خارج المستودع | عدم اتباع symlink افتراضيًا والتحقق من real path. |
| YAML abuse | aliases/huge payload/malformed frontmatter | حجم أقصى، parser آمن، explicit UTF-8، schema validation. |
| Script execution | سكربت مهارة ضار أثناء inspect | لا تنفيذ في MVP؛ allowlist/sandbox لاحقًا. |
| Secret leakage | مفتاح API داخل note أو skill | redaction warnings، no-network default، منع حفظ secrets في reports. |
| Unicode confusables | معرفات متشابهة بصريًا | normalized ID policy وتحذير confusables دون تغيير النص الخام. |
| Authority spoofing | LLM يخرج OWNER_APPROVED | رفض schema/state transition وتسجيل violation. |
| Archive tampering | تعديل ZIP بدل المصدر | protected path + rebuild-only policy. |
| Dependency drift | validator يتغير ويعطي نتائج مختلفة | pin versions/commit hashes وlock file وتسجيل tool versions. |
| External resource contamination | مرجع ويب بلا hash/license/lineage | Resource policy؛ default BLOCKED حتى التسجيل. |

### 15.2 سياسات أمنية إلزامية

- No network by default؛ التمكين يكون صريحًا لكل تشغيل أو profile.
- No execute أثناء inspect؛ الفحص البنيوي لا يستورد ولا يشغل كود الهدف.
- Maximum input/file sizes لمنع الاستهلاك غير المحدود.
- Logs لا تحتوي أسرارًا أو النص الكامل عند تفعيل redaction policy.
- كل dependency خارجية مثبتة في lock file وسجل third-party components.
- الـPatch لاحقًا يطبق على candidate SHA محدد، ويرفض إذا تغير HEAD أو worktree.
- الخطأ البيئي يصنف ENVIRONMENT_DEFECT ولا يؤدي إلى إضعاف الاختبار أو السياسة.

## 16. الأدوات والمشاريع المفتوحة المقترحة

التوصية ليست تجميع منصة ثقيلة، بل اعتماد مكونات صغيرة في النواة، واستخدام أدوات أكبر فقط عند بلوغ مرحلة تبررها الأدلة.

| المشروع/الأداة | القرار | الاستخدام | الحدود |
| --- | --- | --- | --- |
| Agent Skills Specification + skills-ref | ADOPT NOW | المعيار المحمول وبوابة التحقق الأساسية لـSKILL.md والتسمية/frontmatter. | لا يُستبدل بقواعد محلية؛ يُثبت إصدار/commit. |
| agentskills/agentskills examples | REFERENCE | مرجع بنية وممارسة وتوافق عبر المنتجات. | لا نسخ أعمى؛ المصدر الرسمي للمواصفة أولًا. |
| anthropics/skills | REFERENCE | أمثلة واسعة لأنماط skills والموارد والسكريبتات. | أمثلة لا سلطة معيارية داخل المشروع. |
| OpenAI Plugins / Build skills | ADAPTER REFERENCE | لتغليف skill في plugin أو metadata خاصة بمنتج لاحقًا. | portable skill يبقى مستقلًا؛ product adapter منفصل. |
| Pydantic | ADOPT NOW | عقود typed، validation، JSON Schema، وحالات domain. | النواة تعتمد models لا ملفات مباشرة. |
| Typer + Rich | ADOPT NOW | CLI type-safe وعرض عربي للجداول والأخطاء وJSON. | واجهة فقط؛ لا منطق مجال. |
| ruamel.yaml أو parser round-trip مماثل | ADOPT NOW | قراءة/كتابة YAML مع الحفاظ على الترتيب والتعليقات في staging. | تبعية مثبتة؛ UTF-8 صريح. |
| python-jsonschema | ADOPT NOW | تحقق مستقل من ملفات YAML/JSON بعد تحويلها لكائنات. | Draft ثابت في schemas. |
| pytest + property tests | ADOPT NOW | وحدات، Golden Fixtures، path/security، snapshots. | لا تعتمد claim إلا على ما تختبره. |
| Git CLI | ADOPT NOW | hashes، diff، worktree، candidate identity، durable history. | يستخدم عبر Port مع أوامر allowlisted. |
| Promptfoo | PHASE 2 | اختبار trigger/output والمهارة مع عدة نماذج وCI محلي. | ليس بوابة المصدر أو المسار؛ eval إضافي. |
| Langfuse | DEFER | تتبع/evals/datasets عند إدخال LLM أو تشغيل جماعي مستمر. | غير مناسب لـMVP ملفات/CLI صغيرة. |
| Conftest / OPA | DEFER | Policy-as-code عبر YAML/JSON عند توسع الحوكمة بين مستودعات. | ابدأ بقواعد Python صريحة؛ لا تضف Rego مبكرًا. |
| CUE | DEFER | قيود cross-document وتوليد/توحيد schemas عند تعقدها. | Pydantic + JSON Schema كافيان أولًا. |

### 16.1 قرار Build vs Adopt

يجب بناء منطق Skill Steward الخاص: taxonomy، ChangePacket، authority/boundary resolver، manifest routing، append-only intake، conflict semantics، والقوالب الخاصة بـLisan Quran. ويجب اعتماد المكتبات المفتوحة للمهام العامة: parsing، validation، CLI، Git، واختبارات LLM. لا حاجة لبناء Agent framework أو vector database أو workflow engine في MVP.

### 16.2 توافق Agent Skills

يُعامل Agent Skills كصيغة skill المحمولة: SKILL.md إلزامي، والـscripts/references/assets اختيارية. يحافظ Skill Steward على progressive disclosure، ويجعل المراجع نسبية من skill root، ويشغّل skills-ref كاختبار توافق. أي ملف مثل agents/openai.yaml أو plugin.json هو Adapter خاص بمنتج ولا يدخل في المصدر المحمول إلا بقرار منفصل.

## 17. Master Requirements Catalog

المتطلبات التالية معيارية للمشروع المقترح. كلمة «يجب» تعني شرط قبول، و«ينبغي» تعني قرارًا افتراضيًا يمكن تغييره بقرار موثق.

### 17.1 الحوكمة والسلطة — GOV

| ID | المتطلب | دليل القبول |
| --- | --- | --- |
| GOV-001 | يجب أن تكون كل عملية مرتبطة بملف Profile وManifest معتمدين. | اختبار يرفض التشغيل بلا profile/manifest صالح. |
| GOV-002 | يجب أن يبقى Manifest محميًا من التعديل العادي ومن LLM. | Protected-path test + authority test. |
| GOV-003 | يجب ألا تنتج الأداة OWNER_APPROVED أو RELEASE_ACCEPTED. | State-transition negative tests. |
| GOV-004 | يجب تطبيق ترتيب مصادر السلطة قبل مقارنة القواعد أو توليد الاقتراح. | Precedence fixture with conflicting sources. |
| GOV-005 | يجب إظهار سلطة المراجعة والتطبيق لكل ChangeItem. | Schema required field + report snapshot. |
| GOV-006 | يجب فصل proposal عن owner decision في ملف وسجل مستقلين. | File layout and immutability test. |
| GOV-007 | يجب تسجيل سبب كل رفض أو توقف برمز typed. | All stop branches return typed outcome. |
| GOV-008 | يجب حفظ التاريخ عبر supersede/reopen/migrate وعدم الحذف الصامت. | Migration/supersession tests. |
| GOV-009 | يجب تصنيف التغيير الذي يمس QADR/ADR كقرار سلطة لا Patch عادي. | Conflict fixture. |
| GOV-010 | يجب أن يكون تطبيق أي Patch لاحقًا مرتبطًا بـpacket hash وcandidate SHA. | Stage/apply contract tests. |
| GOV-011 | يجب أن يظل CI بوابة تحقق لا سلطة قبول إصدار. | Release status policy test. |
| GOV-012 | يجب إظهار الافتراضات وما لم يمكن التحقق منه. | Report completeness test. |

### 17.2 المصدر والـManifest — SRC

| ID | المتطلب | دليل القبول |
| --- | --- | --- |
| SRC-001 | يجب أن يحدد Manifest active skill root وentrypoint والصيغة. | Manifest schema validation. |
| SRC-002 | يجب أن يحدد artifact roles دون hard-coded paths في المصنف. | Router unit tests with alternate profile. |
| SRC-003 | يجب أن يحدد protected paths وgenerated/archive patterns. | Protected path fixtures. |
| SRC-004 | يجب أن تكون جميع المسارات repo-relative ومطبعة. | Path normalization tests. |
| SRC-005 | يجب رفض أي path يخرج من approved roots. | Traversal and symlink tests. |
| SRC-006 | يجب أن يحمل كل Profile schema_version وprofile_version وstatus. | Schema required fields. |
| SRC-007 | يجب فهرسة hash وID وversion وstatus لكل artifact معروف. | Index snapshot. |
| SRC-008 | يجب اكتشاف duplicate IDs والملفات orphaned والروابط المكسورة. | Inspector integration tests. |
| SRC-009 | يجب قراءة الملفات بترميز UTF-8 صريح على جميع الأنظمة. | Windows/Linux encoding tests. |
| SRC-010 | يجب رفض تحديد هدف كتابة عند غياب role أو source root. | ACTIVE_SOURCE_UNDECLARED fixture. |

### 17.3 الالتقاط والسجل الخام — INT

| ID | المتطلب | دليل القبول |
| --- | --- | --- |
| INT-001 | يجب حفظ النص الخام كما ورد دون normalization داخل raw_text. | Byte/hash equality test. |
| INT-002 | يجب إنشاء Intake ID ثابت وفريد. | ID generation tests. |
| INT-003 | يجب حساب SHA-256 للمحتوى والسياق المحدد. | Known hash test. |
| INT-004 | يجب أن يكون inbox append-only. | Mutation refusal test. |
| INT-005 | يجب حفظ actor/source/timestamp/profile/context references. | Schema required fields. |
| INT-006 | يجب دعم نص عربي ومزيج عربي/إنجليزي ومسارات وكود. | Unicode fixtures. |
| INT-007 | يجب السماح بإرفاق evidence pointers دون دمجها في النص الخام. | Serialization test. |
| INT-008 | يجب وضع حدود حجم وقبول واضحة للمدخلات. | Oversize rejection test. |
| INT-009 | يجب إتاحة capture من stdin و--file و--text. | CLI tests. |
| INT-010 | يجب ألا يرسل capture أي بيانات إلى الشبكة. | Network mock/deny test. |

### 17.4 التفكيك والتصنيف — CLS

| ID | المتطلب | دليل القبول |
| --- | --- | --- |
| CLS-001 | يجب تفكيك الملاحظة المركبة إلى AtomicStatements مع source spans. | Golden decomposition tests. |
| CLS-002 | يجب دعم أكثر من DomainFamily للملاحظة الواحدة. | Multi-label fixture. |
| CLS-003 | يجب دعم أكثر من ArtifactType لكل AtomicStatement عند الحاجة. | Change item derivation test. |
| CLS-004 | يجب تمثيل STATUS وGOV كأبعاد لا كعائلات تشغيلية افتراضيًا. | Taxonomy schema test. |
| CLS-005 | يجب تمثيل FAIL كFailureMode/Finding واختبار تابع. | Failure mapping fixture. |
| CLS-006 | يجب تمثيل CARD كعرض مولد لا مادة أولية. | Card generation policy test. |
| CLS-007 | يجب تطبيق قواعد حتمية للحالات الواضحة قبل LLM. | LLM-disabled fixtures. |
| CLS-008 | يجب إظهار rule IDs التي أنتجت كل تصنيف. | Explainability snapshot. |
| CLS-009 | يجب إظهار البدائل وعدم إخفاء الالتباس المؤثر. | Ambiguity fixture. |
| CLS-010 | يجب ألا تعني HIGH confidence أي حالة اعتماد. | State invariant test. |
| CLS-011 | يجب التمييز بين Request وResult وFinding وRule. | Cross-class fixtures. |
| CLS-012 | يجب التمييز بين موضع محلي وقاعدة عامة. | RULE_NOT_GENERALIZABLE fixture. |
| CLS-013 | يجب دعم Classification versioning وإعادة التصنيف دون تغيير Intake. | Versioned classification test. |
| CLS-014 | يجب أن يكون ناتج LLM structured ومتحققًا ويرفض الحقول المحظورة. | Malformed/authority output tests. |

### 17.5 المطابقة والتعارض والتوجيه — RTE

| ID | المتطلب | دليل القبول |
| --- | --- | --- |
| RTE-001 | يجب فحص exact ID/hash قبل التشابه الدلالي. | Match precedence test. |
| RTE-002 | يجب إرجاع DUPLICATE عند وجود عنصر مكافئ مثبت. | Duplicate fixture. |
| RTE-003 | يجب إرجاع OVERLAPPING_RULE عند التداخل غير الكامل. | Overlap fixture. |
| RTE-004 | يجب إرجاع EXISTING_RULE_VIOLATION عند مخالفة قاعدة موجودة. | Blind Lab fixture. |
| RTE-005 | يجب إنشاء ProposedRule فقط عند ثبوت METHODOLOGY_GAP. | Gap vs violation fixtures. |
| RTE-006 | يجب حل boundary قبل target path. | Runtime/skill boundary fixture. |
| RTE-007 | يجب تحديد target role من artifact-map لا من LLM. | Mock LLM path injection test. |
| RTE-008 | يجب إرفاق template/schema/authority/tests من maps المعتمدة. | Router contract test. |
| RTE-009 | يجب منع target protected وإرجاع السبب. | Protected path fixture. |
| RTE-010 | يجب كشف التعارض مع QADR/Policy وإيقاف التنفيذ. | Authority conflict fixture. |
| RTE-011 | يجب أن ينتج تغيير متعدد الحدود ChangeItems منفصلة مترابطة. | Boundary split fixture. |
| RTE-012 | يجب أن تكون نتيجة التوجيه قابلة للتكرار مع نفس الفهرس والإصدارات. | Determinism test. |

### 17.6 ChangePacket والتأليف — AUT

| ID | المتطلب | دليل القبول |
| --- | --- | --- |
| AUT-001 | يجب أن يحتوي ChangePacket رابطًا إلى IntakeRecord الأصلي. | Schema/reference validation. |
| AUT-002 | يجب أن يحمل كل ChangeItem ID ونوع عملية وtarget role. | Schema required fields. |
| AUT-003 | يجب أن يوضح كل ChangeItem سبب اشتقاقه. | Rationale presence test. |
| AUT-004 | يجب أن يذكر required enforcement وpositive/negative tests. | Template completeness test. |
| AUT-005 | يجب أن يحدد authority وversion impact المقترح. | Schema validation. |
| AUT-006 | يجب ألا يكتب propose إلى active skill source. | Filesystem sandbox test. |
| AUT-007 | يجب أن يولد draft من template مطابق لـArtifactType. | Template routing tests. |
| AUT-008 | يجب الحفاظ على identifiers/code/path tokens الإنجليزية في العرض العربي. | Language fixture. |
| AUT-009 | يجب دعم create/update/deprecate/supersede/no-change. | Operation enum tests. |
| AUT-010 | يجب إظهار preserved scope وما لن يتغير. | Proposal report test. |
| AUT-011 | يجب منع إنشاء artifact ناقص الحقول الإلزامية. | Schema negative tests. |
| AUT-012 | ينبغي أن يدعم full product staging worktree ذريًا بعد الاعتماد. | Later phase acceptance tests. |

### 17.7 التحقق والـLint — VAL

| ID | المتطلب | دليل القبول |
| --- | --- | --- |
| VAL-001 | يجب تشغيل skills-ref على كل skill draft/candidate. | Integration test. |
| VAL-002 | يجب التحقق من frontmatter والحقول والاسم والوصف. | Valid/invalid fixtures. |
| VAL-003 | يجب التحقق من الروابط النسبية والملفات المشار إليها. | Broken reference tests. |
| VAL-004 | يجب كشف reference chains العميقة والدورات. | Graph tests. |
| VAL-005 | يجب فحص SKILL.md مقابل حد الحجم المعتمد وإظهار warning/error policy. | Budget fixtures. |
| VAL-006 | يجب فحص duplicate/undefined IDs والمراجع. | Registry tests. |
| VAL-007 | يجب التحقق من language/terminology policy في المخرجات المطلوبة. | Localization fixtures. |
| VAL-008 | يجب فحص أن كل Rule لها trigger/failure/test/authority. | Rule schema tests. |
| VAL-009 | يجب فحص أن كل Finding مرتبط بدليل وسلوك متوقع/فعلي. | Finding schema tests. |
| VAL-010 | يجب فصل environment defect عن product/test defect. | Failure classification tests. |
| VAL-011 | يجب إخراج machine-readable validation report. | JSON snapshot. |
| VAL-012 | يجب ربط ValidationEvidence بالـcandidate/profile/tool hashes. | Evidence schema test. |

### 17.8 الاختبارات والتقييم — EVAL

| ID | المتطلب | دليل القبول |
| --- | --- | --- |
| EVAL-001 | يجب إنشاء Golden Fixtures من ملاحظات المستخدم الفعلية قبل التوسع. | Fixture inventory review. |
| EVAL-002 | يجب أن تحتوي fixture على required وforbidden outcomes. | Fixture schema. |
| EVAL-003 | يجب أن تمر جميع fixtures الحتمية قبل الانتقال من MVP. | CI gate. |
| EVAL-004 | يجب اختبار should-trigger وshould-not-trigger عند إنشاء/تعديل description. | Trigger eval report. |
| EVAL-005 | يجب قياس decomposition وclassification وrouting كل على حدة. | Metrics report. |
| EVAL-006 | يجب مقارنة LLM-enabled بنتيجة baseline الحتمية وعدم السماح له بكسر invariants. | A/B fixture tests. |
| EVAL-007 | يجب الاحتفاظ بأمثلة adversarial وboundary/conflict. | Fixture coverage audit. |
| EVAL-008 | يجب اختبار UTF-8 وWindows paths والمسارات الطويلة. | Cross-platform CI. |
| EVAL-009 | ينبغي استخدام Promptfoo فقط لتقييم السلوك/trigger لا حوكمة المسار. | Configuration review. |
| EVAL-010 | يجب أن تكون معايير الانتقال إلى apply mode معتمدة من المالك. | Phase gate document. |

### 17.9 واجهة CLI — CLI

| ID | المتطلب | دليل القبول |
| --- | --- | --- |
| CLI-001 | يجب أن تكون الرسائل الموجهة للمستخدم عربية افتراضيًا. | CLI snapshot. |
| CLI-002 | يجب دعم --json لكل أمر معلوماتي. | CLI integration tests. |
| CLI-003 | يجب أن تكون exit codes ثابتة وموثقة. | Exit code tests. |
| CLI-004 | يجب إظهار status وowner decision وwrite policy بوضوح. | Output snapshot. |
| CLI-005 | يجب إخفاء التفاصيل الحساسة وفق redaction policy. | Secret fixture. |
| CLI-006 | يجب دعم Windows PowerShell وLinux shells دون أوامر داخلية مفترضة. | Cross-platform tests. |
| CLI-007 | يجب أن تعمل أوامر MVP دون خدمة خلفية أو قاعدة بيانات. | Offline smoke test. |
| CLI-008 | يجب إظهار matched rules/conflicts/targets بطريقة قابلة للقراءة. | Report snapshot. |
| CLI-009 | يجب أن تكون أوامر write المستقبلية منفصلة وصريحة وغير افتراضية. | Command tree test. |
| CLI-010 | يجب أن يرفض CLI flags غير المتوافقة بدل التخمين. | Argument validation tests. |

### 17.10 الأمن والخصوصية — SEC

| ID | المتطلب | دليل القبول |
| --- | --- | --- |
| SEC-001 | يجب أن تكون الشبكة معطلة افتراضيًا. | Network deny test. |
| SEC-002 | يجب ألا ينفذ inspect أي script من المهارة. | Execution spy test. |
| SEC-003 | يجب منع traversal وsymlink escape. | Security fixtures. |
| SEC-004 | يجب فرض حدود حجم على notes/files/YAML aliases. | Resource limit tests. |
| SEC-005 | يجب قراءة YAML بطريقة آمنة ومتحقق منها. | Malicious YAML fixtures. |
| SEC-006 | يجب منع LLM من تمرير أوامر/مسارات/حالات سلطة. | Prompt injection fixtures. |
| SEC-007 | يجب تسجيل model/provider عند الاستخدام دون تسجيل أسرار. | Telemetry test. |
| SEC-008 | يجب منع حفظ مفاتيح أو tokens معروفة في proposals. | Secret scanner fixture. |
| SEC-009 | يجب تثبيت dependencies وإثبات المصدر والترخيص. | Lock/SBOM review. |
| SEC-010 | يجب أن يكون Patch المستقبل مرشحًا hash-bound ويرفض drift. | TOCTOU tests. |
| SEC-011 | يجب حماية manifest/authority/protected-path configs. | Write denial tests. |
| SEC-012 | يجب أن يصدر النظام AuditEvent لكل محاولة محظورة. | Audit event test. |

### 17.11 التشغيل والتكامل — OPS

| ID | المتطلب | دليل القبول |
| --- | --- | --- |
| OPS-001 | يجب أن تكون النواة مستقلة عن Lisanapp وFastAPI وSQLite. | Dependency architecture test. |
| OPS-002 | يجب استخدام Ports لـGit وfilesystem وLLM وruntime index. | Architecture lint/review. |
| OPS-003 | يجب أن يعمل MVP بملفات محلية وGit فقط. | Offline end-to-end test. |
| OPS-004 | يجب تثبيت project/profile/tool versions في كل evidence. | Evidence test. |
| OPS-005 | يجب دعم cache قابل للإبطال عند تغير hashes. | Cache invalidation tests. |
| OPS-006 | يجب أن تكون logs structured وقابلة للقراءة. | Log schema test. |
| OPS-007 | يجب تصنيف failures قبل تغيير النطاق أو المتطلبات. | Failure handling fixtures. |
| OPS-008 | يجب أن تتبع مراحل التحقق V0–V4 دون إعادة فحوص مكلفة بلا سبب. | Verification plan review. |

## 18. خطة التنفيذ وحزم العمل

### 18.1 استراتيجية التنفيذ

ينفذ المشروع بوكلاء كتابة واحد افتراضيًا، مع مراجعات مستقلة read-only عند البوابات. لا يبدأ العمل بتوليد الكود؛ يبدأ بتثبيت source of truth وGolden Fixtures، لأن نجاح الأداة يقاس بدقة التصنيف والتوجيه لا بعدد الملفات المنشأة.

| WP | العنوان | النطاق | المخرج | البوابة |
| --- | --- | --- | --- | --- |
| WP-00 | Repository Preflight & Decision Baseline | فحص المستودع، تثبيت active source، قراءة السياسات، إنشاء ADR/QADR للمشروع. | Preflight report + approved decision draft | V0 |
| WP-01 | Profile & Manifest Governance | Schemas وmanifest وtaxonomy/artifact/authority/protection maps. | Validated lisan-quran profile | V1 + owner review |
| WP-02 | Domain Models & Invariants | Pydantic models والحالات وtyped outcomes وcanonical hashing. | SS-CORE + unit tests | V1 |
| WP-03 | Append-Only Intake Store | capture، IDs، hashes، UTF-8، evidence pointers، file layout. | skillctl capture | V1 |
| WP-04 | Repository/Skill Inspector | فهرسة SKILL.md والمراجع والـIDs والروابط والحماية. | ArtifactIndex + graph | V1/V2 |
| WP-05 | Deterministic Classifier | تفكيك وقواعد الحالات الواضحة وتصنيف التخصص والمحاور. | skillctl classify | V1 + fixtures |
| WP-06 | Conflict & Boundary Resolver | duplicate/overlap/conflict/existing violation/runtime boundary. | Typed resolution engine | V2 |
| WP-07 | ChangePacket Proposal Engine | Templates، target roles، tests، authority، version impact، reports. | skillctl propose/show | V2 |
| WP-08 | Validation & Skill Conformance | JSON Schema، skills-ref، internal lint، security checks. | skillctl validate | V2 |
| WP-09 | Golden Fixtures & Metrics | العينات الواقعية ومعايير القبول وتقارير القياس. | fixtures run + evidence | V3 |
| WP-10 | Optional LLM Adapter | structured decomposition/drafting مع no-authority constraints. | LLM-disabled baseline + optional adapter | V2/V3 |
| WP-11 | MVP Release Gate | Cross-platform tests، docs، SBOM/lock، independent review. | TECHNICALLY_RELEASE_READY candidate | V4 |
| WP-12 | Staging Patch Pilot | بعد اعتماد منفصل: worktree staging وdiff وatomic patch. | APPROVED_FOR_STAGING pilot | Fresh phase |
| WP-13 | Supervised Apply & Packaging | بعد إثبات الجدارة: owner-authorized apply وإعادة بناء الحزمة. | Candidate release process | V4 + release authority |

### 18.2 بنية المستودع المقترحة

```text
tools/skill-steward/
├── pyproject.toml
├── src/skill_steward/
│   ├── domain/
│   ├── application/
│   ├── ports/
│   ├── adapters/
│   └── interfaces/cli/
├── schemas/
├── templates/
├── profiles/lisan-quran/
│   ├── skill-authoring-manifest.yaml
│   ├── taxonomy.yaml
│   ├── artifact-map.yaml
│   ├── routing-rules.yaml
│   ├── authority-map.yaml
│   ├── enforcement-map.yaml
│   └── protected-paths.yaml
└── tests/
    ├── unit/
    ├── integration/
    ├── golden/
    └── security/

<owner-approved-records-root>/
├── inbox/
├── classifications/
├── proposals/
├── decisions/
├── evidence/
└── migrations/

الـactive skill root لا يُفترض هنا؛ يثبته manifest بعد V0.
```

### 18.3 Definition of Done لـMVP

- جميع المتطلبات GOV/SRC/INT/CLS/RTE/AUT/VAL/EVAL/CLI/SEC/OPS داخل نطاق MVP إما منفذة أو موسومة deferred بقرار مالك.
- Golden Fixtures العشر الأساسية تمر حتميًا بنسبة 100%.
- أوامر capture/classify/propose/show/validate/index/fixtures تعمل على Windows وLinux.
- لا توجد أي كتابة إلى active skill أو manifest أو protected paths في اختبارات end-to-end.
- skills-ref يمر على fixtures الصالحة ويفشل بصورة متوقعة على fixtures غير الصالحة.
- التقرير يبين result، classified items، target roles، tests، authority، conflicts، وwrite policy.
- فشل البيئة لا يؤدي إلى تغيير العقود أو تعطيل الاختبارات.
- مراجعة مستقلة تؤكد boundary separation وعدم وجود مسار اعتماد ذاتي.

## 19. بوابات التحقق والإصدار

| البوابة | متى | الأدلة المطلوبة |
| --- | --- | --- |
| V0 Preflight | بداية الجلسة/الاستئناف أو تغير السياق | branch/HEAD/worktree، policies، source roots، toolchain. |
| V1 Inner Loop | بعد تغيير صغير | أصغر unit/schema/fixture يمكنه دحض التغيير. |
| V2 Checkpoint | بعد حزمة متماسكة أو boundary change | integration + relevant golden/security tests. |
| V3 Phase Gate | نهاية WP/مرحلة | affected subsystem + contracts + docs + fixture metrics. |
| V4 Release Gate | مرشح فعلي ثابت | full project-defined suite، candidate SHA، artifacts، independent review. |

### 19.1 حالات الإثبات

```text
IMPLEMENTED
  → TESTED
  → VERIFIED_FOR_PROFILE
  → TECHNICALLY_RELEASE_READY
  → INDEPENDENTLY_REVIEWED
  → RELEASE_ACCEPTED  # سلطة الإصدار فقط
```

نجاح CI لا يعني RELEASE_ACCEPTED، ووجود implementation لا يعني أن profile الواقعي اجتاز Golden Fixtures، ونتيجة LLM جيدة لا تعد دليلًا على التوجيه أو السلطة.

## 20. أمثلة كاملة من الملاحظة إلى ChangePacket

### 20.1 طلب اللغة ومخالفة تنفيذية

```text
Input:
"استخدم العربية وترجم المصطلحات الإنجليزية، وقد عرض الوكيل Invariant Core دون ترجمة."

Atomic 1:
- Intent: REQUEST
- Concern: LANGUAGE
- ArtifactType: LanguagePolicy
- Outcome: ROUTED

Atomic 2:
- Intent: REQUEST
- Concern: LANGUAGE
- ArtifactType: TerminologyEntry(INVARIANT_CORE)
- Outcome: ROUTED

Atomic 3:
- Intent: DEFECT
- Concern: AGENT_BEHAVIOR
- ArtifactType: ComplianceFinding
- Match: existing language policy if present
- Outcome: EXISTING_RULE_VIOLATION or METHODOLOGY_GAP

Derived:
- RegressionFixture
- No direct write
- Owner decision pending
```

### 20.2 القلم والسطر

```text
Input:
"أنت فسرت القلم بأنه أداة كتابة قبل أن تحلل سطر."

Domain tags:
- OBJ-CIRCULAR
- OBJ-PRIOR
- possible OBJ-STATUS

ChangeItems:
1. ComplianceFinding for current analysis
2. COR-DOWNGRADE / COR-REOPEN proposal for QLM result, if evidence confirms
3. REQ-ROOT: STR
4. REQ-AUDIT: QLM
5. RegressionFixture preventing circular adjacent-term definition

Not automatic:
- No MethodologyRule unless no existing rule covers it
- No semantic definition for STR
- No ROOT_CORE_LOCKED
```

### 20.3 قاعدة Runtime وعرض تقرير

```text
Input:
"كل Observation يجب أن يحمل source hash ويجب عرض الـhash في التقرير."

ChangeItem A:
- Boundary: LISAN_RUNTIME
- ArtifactType: RuntimeContract / SchemaChange
- Enforcement: SCHEMA + VALIDATOR + typed rejection

ChangeItem B:
- Boundary: QURAN_SKILL
- ArtifactType: OutputContract
- Enforcement: TEMPLATE + VALIDATOR

Result:
SPLIT_INTO_MULTIPLE_ARTIFACTS
RUNTIME_SKILL_BOUNDARY_VIOLATION avoided by explicit split
```

### 20.4 طلب يناقض قرارًا قائمًا

```text
Input:
"اجعل التفاسير متاحة داخل Blind Lab قبل القفل."

Match:
- accepted QADR prohibits prior/tafsir before lock

Outcome:
CONFLICT_REQUIRES_OWNER_DECISION

Proposal:
- Record request and conflict evidence
- No rule update
- No patch
- Optional ADR/QADR reconsideration request only
```

## 21. المخاطر والقرارات المطلوبة

### 21.1 سجل المخاطر

| الخطر | الاحتمال/الأثر | المعالجة |
| --- | --- | --- |
| تضخم taxonomy | متوسط/عالٍ | ثماني families ثابتة + محاور عامة + owner-approved extensions. |
| اعتماد مفرط على LLM | متوسط/عالٍ | LLM-disabled baseline وحظر المسار/السلطة عليه. |
| Manifest يصبح مصدر خطأ | منخفض/عالٍ | حماية، QADR، schema، independent review، tests. |
| مسارات المستودع تختلف عن المقترح | عالٍ/متوسط | V0 وإبقاء path examples غير معيارية حتى الاعتماد. |
| تكرار مصادر القواعد | متوسط/عالٍ | canonical role + duplicate/overlap detection + migrations. |
| Golden set متحيز | متوسط/متوسط | holdout fixtures وadversarial cases ومراجعة بشرية. |
| إضافة أدوات ثقيلة مبكرًا | متوسط/متوسط | CLI/files/Pydantic أولًا؛ defer Langfuse/OPA/CUE. |
| مشاكل Windows/Unicode | عالٍ/متوسط | explicit UTF-8، pathlib، CI Windows، fixtures عربية. |
| تحول proposal-only إلى كتابة غير مضبوطة | منخفض/عالٍ | لا أوامر write في MVP، filesystem capability deny. |

### 21.2 قرارات المالك المطلوب تثبيتها قبل التنفيذ

| القرار | التوصية |
| --- | --- |
| اسم المنتج | Skill Steward |
| اسم الطبقة | Skill Authoring Control Plane |
| الموضع الأولي | tools/skill-steward داخل Lisanapp مع استقلال الحزم. |
| موقع Profile/Manifest | يُحسم بعد V0؛ يبقى repo-relative ومحميًا. |
| نطاق MVP | capture/classify/propose/show/index/validate/fixtures فقط. |
| الكتابة | ممنوعة على active source؛ proposal records فقط. |
| التخزين | YAML/JSON + Git؛ لا DB. |
| LLM | اختياري ومعطل افتراضيًا؛ deterministic baseline إلزامي. |
| المعيار المحمول | Agent Skills Specification + skills-ref. |
| واجهة المستخدم | CLI عربي؛ Web/REST deferred. |
| الانتقال إلى staging | قرار مرحلة مستقل بعد اجتياز metrics والمراجعة. |

## 22. قرارات ADR/QADR المقترحة

| المعرف المقترح | العنوان | القرار |
| --- | --- | --- |
| ADR-SS-0001 | فصل Skill Steward عن Runtime وMethodology Control Plane | نواة مستقلة + Ports/Adapters. |
| ADR-SS-0002 | Proposal-Only MVP | لا apply ولا active writes. |
| ADR-SS-0003 | Manifest as Protected Authoring Authority | المسارات والأدوار والسلطات تُحل منه. |
| QADR-SS-0004 | Two-Layer Classification Model | ثماني domain families + محاور حوكمة عامة. |
| ADR-SS-0005 | Append-Only Intake and ChangePacket Unit | الأصل immutable والحزمة ذرية. |
| ADR-SS-0006 | Deterministic-First Optional LLM | LLM لا يختار path/authority/state. |
| ADR-SS-0007 | Files + Git Storage for MVP | لا DB حتى تثبت الحاجة. |
| ADR-SS-0008 | Agent Skills Portability Boundary | portable core منفصل عن product adapters. |
| ADR-SS-0009 | Golden Fixtures as Phase Gate | لا توسع قبل دقة التصنيف والتوجيه. |
| ADR-SS-0010 | Staging Worktree Before Apply | أي كتابة مستقبلية تسبقها staging وعقد مالك. |

## 23. توصية التنفيذ بواسطة Codex

| الحقل | التوصية |
| --- | --- |
| Model | Terra |
| Reasoning | high |
| Mode | Plan→Execute |
| Thread | نفس thread للمشروع حتى إغلاق MVP؛ مراجعة قبول مستقلة في thread read-only جديد. |
| Rationale | التنفيذ متعدد الحزم والعقود والاختبارات لكنه محدد؛ لا يحتاج Sol إلا عند تعارض معماري غير محسوم أو مراجعة أمنية مستقلة عالية المخاطر. |

```text
Goal: Implement the proposal-only MVP of Skill Steward as a separate, reusable tool inside the Lisanapp repository.

Source of truth: owner-approved Skill Steward specification, repository AGENTS/policies, canonical requirements, accepted ADR/QADR documents, the approved skill-authoring manifest/profile, and the Agent Skills specification.

Scope: V0 repository preflight; protected lisan-quran authoring profile; typed IntakeRecord, AtomicStatement, ClassificationSet, ArtifactIndex, ChangeItem, ChangePacket, OwnerDecision, and ValidationEvidence models; append-only YAML/JSON intake store; read-only skill/repository inspector; deterministic multi-axis classifier; duplicate/overlap/conflict and skill/runtime boundary resolution; proposal generation; Arabic Typer/Rich CLI for profile validate, index, capture, classify, propose, show, validate, and fixtures run; skills-ref integration; golden and security fixtures.

Constraints: proposal-only; no apply/stage commands; no writes to active skill files, manifest, archives, ZIPs, generated outputs, runtime control-plane registries, or Lisanapp data; no script execution during inspection; UTF-8 explicit; Windows and Linux support; network disabled by default; LLM optional and unable to select paths, authority, approval states, or patches; preserve English IDs, schema fields, code tokens, and paths.

Verification: V0 preflight evidence; focused V1 unit/schema tests; V2 integration tests for routing, boundaries, protected paths, and skills-ref; V3 golden fixture gate covering output format, Arabic terminology, Blind Lab violation, Qalam circularity, missed corpus evidence, root request, QADR conflict, runtime/skill split, protected archive, and KHATT negative inference; cross-platform UTF-8 tests.

Success criteria: all deterministic golden fixtures pass; zero protected-path writes; zero automatic approvals; every ChangeItem has rationale, canonical role, target resolution evidence, authority, enforcement, tests, and version impact; same input/context/profile version produces the same canonical result hash.

Stop condition: stop before staging, active-source modification, package rebuilding, Web/REST UI, database integration, or release acceptance.

Return only: result, changed files, tests/checkpoints, evidence, and blockers.
```

## الملحق أ — مخططات YAML المرجعية

### أ.1 IntakeRecord

```text
schema_version: "1.0"
intake_id: "INT-20260820-0014"
profile_id: "lisan-quran"
created_at: "2026-08-20T16:26:00+03:00"
actor: { type: owner, id: "owner" }
source: { type: conversation, reference: "..." }
raw_text: "..."
raw_sha256: "..."
context_refs: []
evidence_refs: []
status: CAPTURED
append_only: true
```

### أ.2 ChangePacket

```text
schema_version: "1.0"
packet_id: "CP-20260820-0007"
intake_ref: "INT-20260820-0014"
profile_ref: { id: "lisan-quran", version: "1.0.0", hash: "..." }
index_ref: { hash: "...", candidate_sha: "..." }
status: PROPOSED
owner_decision: PENDING
result_codes: [SPLIT_INTO_MULTIPLE_ARTIFACTS]
atomic_statements: []
change_items:
  - change_item_id: "CI-LANG-0001"
    operation: UPDATE
    artifact_type: LanguagePolicy
    target_role: language_policy
    target_path: "<resolved-by-manifest>"
    scope: QURAN_SKILL
    maturity: PROPOSED
    enforcement_loci: [INSTRUCTION, VALIDATOR]
    required_tests: [GF-LANG-001]
    approval_authority: OWNER
    version_impact: MINOR
    rationale: "..."
conflicts: []
validation_plan: []
provenance: { tool_version: "...", rules_hash: "..." }
```

### أ.3 ComplianceFinding

```text
id: "FIND-20260820-003"
intake_ref: "INT-..."
run_ref: "optional"
finding_type: METHODOLOGY_NON_CONFORMANCE
rule_refs: ["QM-RULE-001"]
expected_behavior: "No prior/tafsir before lock"
actual_behavior: "Prior meaning used before lock"
evidence_refs: []
impact: "Invalidates or blocks current result"
reproducible: true
failure_class: FAIL-PRIOR-LEAK
disposition: REGRESSION_REQUIRED
gate_result: BLOCKED_GOVERNANCE
status: PROPOSED
```

## الملحق ب — قاموس المصطلحات

| المصطلح | الترجمة المعتمدة في العرض | ملاحظة |
| --- | --- | --- |
| Skill | مهارة | يحفظ SKILL.md وIDs كما هي. |
| Skill Authoring Control Plane | طبقة ضبط تأليف المهارات | الاسم المعماري. |
| Skill Steward | Skill Steward / قيّم المهارة | اسم المنتج؛ يفضل إبقاء الاسم الإنجليزي. |
| ChangePacket | حزمة تغيير | وحدة ذرية تجمع تغييرات متعددة. |
| ChangeItem | عنصر تغيير | قطعة واحدة داخل الحزمة. |
| ArtifactType | نوع القطعة | Rule/Policy/Test/Finding وغيرها. |
| EnforcementLocus | موضع الإنفاذ | Instruction/Schema/Gate/Test… |
| Golden Fixture | حالة قبول مرجعية | مدخل ونتيجة متوقعة ومحظورات. |
| Append-only | إلحاقي غير قابل للتعديل | السجل الخام لا يحرر بعد الحفظ. |
| Progressive disclosure | الإفصاح المتدرج | تحميل metadata ثم SKILL.md ثم الموارد حسب الحاجة. |
| Owner Decision | قرار المالك | لا يصدر آليًا. |
| Protected Path | مسار محمي | لا يكتب فيه المسار العادي. |
| Staging | مرحلة تحضير معزولة | تسبق أي Apply لاحق. |

## الملحق ج — المراجع

R1. المرفق الداخلي: «اتواع النقاط.md» — تصنيف الملاحظات البحثية وقاعدة تعدد نواتج الملاحظة.

R2. Agent Skills Specification — البنية المحمولة للمهارة، SKILL.md، الحقول، progressive disclosure، والمحقق skills-ref.

R3. agentskills/agentskills — المستودع الرسمي للمواصفة والمرجع البرمجي skills-ref.

R4. anthropics/skills — أمثلة مفتوحة لأنماط المهارات والموارد والسكريبتات.

R5. OpenAI Codex/Plugins documentation — بناء skills وتغليفها كـplugins عند الحاجة إلى توزيع خاص بالمنتج.

R6. Pydantic — عقود البيانات والتحقق باستخدام type hints.

R7. Typer وRich — بناء CLI typed وعرض طرفية غني.

R8. python-jsonschema — التحقق من JSON Schema وإخراج أخطاء دقيقة.

R9. Promptfoo — اختبارات prompts/agents وCI محلي للمرحلة الثانية.

R10. Langfuse — observability/evals/datasets اختيارية عند توسع استخدام LLM.

R11. Conftest/Open Policy Agent — policy-as-code لملفات structured configuration عند الحاجة لاحقًا.

R12. CUE — لغة قيود وتحقق وتوليد schemas اختيارية عند تعقد القيود عبر الملفات.

تاريخ التحقق من المصادر الخارجية: 20 أغسطس 2026. يجب تثبيت الإصدارات أو commit hashes في التنفيذ وعدم الاعتماد على latest غير مثبت.
