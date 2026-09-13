document.addEventListener("DOMContentLoaded", loadProject);

window.addEventListener("languageChanged", () => {
    loadProject();
});


async function loadProject() {

    const c = document.getElementById("project-detail");

    const id = new URLSearchParams(location.search).get("id");


    /*
     * Získání aktuálního jazyka
     */
    const language =
        localStorage.getItem("language") || "cs";

    const t =
        translations[language] || translations.cs;


    /*
     * Pokud není ID zakázky
     */
    if (!id) {

        c.innerHTML = `
            <div class="projects-empty">

                <h3>
                    ${t.offerNotFound}
                </h3>

                <p>
                    ${t.offerNotFoundText}
                </p>

                <a
                    class="btn btn-red"
                    href="projekty.html"
                >
                    ${t.backToProjects}
                    <span>→</span>
                </a>

            </div>
        `;

        return;
    }


    try {

        const {
            data: p,
            error
        } = await getSupabase()
            .from("projects")
            .select("*")
            .eq("id", id)
            .single();


        if (error) {
            throw error;
        }


        /*
         * Titulek stránky
         */
        document.title =
            `${p.title} | DP Montbau Group s.r.o.`;


        /*
         * Termín zakázky
         */
        const dates = p.end_date
            ? `${formatDate(p.start_date)} – ${formatDate(p.end_date)}`
            : `${formatDate(p.start_date)} – ${t.untilNow}`;


        /*
         * Obrázek
         */
        const image = p.image_url
            ? `
                <div class="detail-image">

                    <img
                        src="${escapeHtml(p.image_url)}"
                        alt="${escapeHtml(p.title)}"
                    >

                </div>
            `
            : `
                <div class="detail-image detail-image-placeholder">

                    <span>
                        DP MONTBAU
                    </span>

                </div>
            `;


        /*
         * Hlavní obsah
         */
        c.innerHTML = `

            <!-- ==========================================
                 HEADER NABÍDKY
            =========================================== -->

            <div class="project-detail-header">

                <p class="eyebrow">
                    ${t.currentProjectEyebrow}
                </p>


                <h1>
                    ${escapeHtml(p.title)}
                </h1>


                ${
                    p.excerpt
                        ? `
                            <p class="detail-lead detail-lead-top">
                                ${escapeHtml(p.excerpt)}
                            </p>
                        `
                        : ""
                }


                <div class="detail-meta">

                    <span class="detail-badge">
                        ${escapeHtml(
                            statusLabel(p.status)
                        )}
                    </span>


                    <span class="detail-meta-item">

                        <strong>
                            ${t.workType}
                        </strong>

                        ${escapeHtml(
                            p.work_type || "—"
                        )}

                    </span>


                    <span class="detail-meta-item">

                        <strong>
                            ${t.projectTerm}
                        </strong>

                        ${escapeHtml(dates)}

                    </span>


                    <span class="detail-meta-item">

                        <strong>
                            ${t.workersCount}
                        </strong>

                        ${escapeHtml(
                            String(p.workers || 0)
                        )}

                    </span>

                </div>

            </div>



            <!-- ==========================================
                 HLAVNÍ FOTO
            =========================================== -->

            ${image}



            <!-- ==========================================
                 PODROBNOSTI NABÍDKY
            =========================================== -->

            <div class="detail-description">

                <div class="detail-section-heading">

                    <p class="eyebrow">
                        ${t.projectDetailsEyebrow}
                    </p>

                    <h2>
                        ${t.offerInformation}
                    </h2>

                </div>


                ${
                    p.description
                        ? `
                            <div class="detail-text">
                                ${escapeHtml(p.description)}
                            </div>
                        `
                        : `
                            <div class="detail-text">
                                ${t.noDescription}
                            </div>
                        `
                }

            </div>



            <!-- ==========================================
                 KONTAKT
            =========================================== -->

            <div class="detail-contact-box">

                <div>

                    <p class="eyebrow">
                        ${t.interestedEyebrow}
                    </p>

                    <h2>
                        ${t.interestedTitle}
                    </h2>

                    <p>
                        ${t.interestedText}
                    </p>

                </div>


                <a
                    class="btn btn-red"
                    href="index.html#kontakt"
                >
                    <span>
                        ${t.contactUs}
                    </span>
                    <span>→</span>
                </a>

            </div>

        `;


    } catch (e) {

        console.error(e);

        c.innerHTML = `
            <div class="projects-empty">

                <h3>
                    ${t.offerLoadError}
                </h3>

                <p>
                    ${t.offerLoadErrorText}
                </p>

                <a
                    class="btn btn-red"
                    href="projekty.html"
                >
                    <span>
                        ${t.backToProjects}
                    </span>
                    <span>→</span>
                </a>

            </div>
        `;
    }
}