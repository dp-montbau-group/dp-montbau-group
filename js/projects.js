document.addEventListener("DOMContentLoaded", loadProjects);

window.addEventListener("languageChanged", () => {
    loadProjects();
});


async function loadProjects() {

    const g = document.getElementById("projects-grid");

    /*
     * Aktuální jazyk
     */
    const language =
        localStorage.getItem("language") || "cs";

    const t =
        translations[language] || translations.cs;


    try {

        const {
            data,
            error
        } = await getSupabase()
            .from("projects")
            .select(
                "id,title,start_date,end_date,work_type,workers,status,excerpt,image_url"
            )
            .order(
                "start_date",
                { ascending: false }
            );


        if (error) {
            throw error;
        }


        /*
         * Žádné projekty
         */
        if (!data?.length) {

            g.innerHTML = `
                <div class="projects-empty">

                    <h3>
                        ${t.noProjects}
                    </h3>

                    <p>
                        ${t.noProjectsText}
                    </p>

                </div>
            `;

            return;
        }


        /*
         * Vykreslení projektů
         */
        g.innerHTML = data.map(p => {

            const image = p.image_url
                ? `
                    <img
                        src="${escapeHtml(p.image_url)}"
                        alt="${escapeHtml(p.title)}"
                        loading="lazy"
                    >
                `
                : `
                    <div class="project-placeholder">
                        DP MONTBAU
                    </div>
                `;


            /*
             * Termín
             */
            const dates = p.end_date
                ? `${formatDate(p.start_date)} – ${formatDate(p.end_date)}`
                : `${formatDate(p.start_date)} – ${t.untilNow}`;


            /*
             * Počet pracovníků
             */
            const workers =
                String(p.workers || 0);


            return `
                <article class="project-card">

                    <a
                        href="projekt.html?id=${encodeURIComponent(p.id)}"
                        aria-label="${t.viewProject} ${escapeHtml(p.title)}"
                    >

                        <div class="project-card-image">

                            ${image}

                        </div>


                        <div class="project-card-content">

                            <span class="project-card-category">
                                ${escapeHtml(
                                    p.work_type || t.realization
                                )}
                            </span>


                            <h3>
                                ${escapeHtml(p.title)}
                            </h3>


                            <p>
                                ${escapeHtml(
                                    p.excerpt || ""
                                )}
                            </p>


                            <div class="project-card-meta">

                                <span>
                                    ${escapeHtml(dates)}
                                </span>

                                <span>
                                    ${escapeHtml(workers)}
                                    ${t.workers}
                                </span>

                            </div>


                            <div class="project-card-bottom">

                                <span class="badge">
                                    ${escapeHtml(
                                        statusLabel(p.status)
                                    )}
                                </span>


                                <span class="project-card-link">

                                    ${t.viewProject}

                                    <span>
                                        →
                                    </span>

                                </span>

                            </div>

                        </div>

                    </a>

                </article>
            `;

        }).join("");


    } catch (e) {

        console.error(e);

        g.innerHTML = `
            <div class="projects-empty">

                <h3>
                    ${t.projectsLoadError}
                </h3>

                <p>
                    ${t.projectsLoadErrorText}
                </p>

            </div>
        `;
    }
}