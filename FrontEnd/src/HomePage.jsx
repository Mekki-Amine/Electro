import React from "react";

const HomePage = () => {
  return (
    <div className="font-sans text-gray-200 bg-gray-900 min-h-screen flex flex-col">
      <header className="bg-gray-800 p-4">
        <h1 className="text-3xl font-bold text-white">Bienvenue chez Fixer</h1>
      </header>
      <main className="flex-grow p-4">
        <section id="home" className="my-8">
          <h2 className="text-2xl font-semibold text-white">
            Votre solution rapide pour tous vos appareils.
          </h2>
          <div className="my-4">
            <h3 className="text-xl font-semibold text-gray-300">
              Nos services
            </h3>
            <div className="my-2">
              <h4 className="font-medium text-gray-300">
                Réparation d'électroménagers
              </h4>
              <p>
                Nous sommes spécialisés dans la réparation de tous types
                d'appareils électroménagers...
              </p>
            </div>
            <div className="my-2">
              <h4 className="font-medium text-gray-300">
                Installation et maintenance
              </h4>
              <p>
                Nous assurons également l'installation et la maintenance de vos
                appareils électroménagers...
              </p>
            </div>
            <div className="my-2">
              <h4 className="font-medium text-gray-300">Pièces de rechange</h4>
              <p>
                Nous fournissons des pièces de rechange d'origine pour vos
                appareils électroménagers...
              </p>
            </div>
            <div className="my-2">
              <h4 className="font-medium text-gray-300">Service clientèle</h4>
              <p>Notre engagement envers nos clients est notre priorité...</p>
            </div>
            <div className="my-2">
              <h4 className="font-medium text-gray-300">
                Conseils d'entretien
              </h4>
              <p>
                Profitez de nos conseils d'entretien pour optimiser la durée de
                vie de vos appareils...
              </p>
            </div>
          </div>
        </section>
        <section id="about" className="my-8">
          <h3 className="text-xl font-semibold text-gray-300">
            Pourquoi nous choisir ?
          </h3>
          <ul className="list-disc list-inside text-gray-300">
            <li>Expertise éprouvée</li>
            <li>Service rapide</li>
            <li>Transparence et confiance</li>
            <li>Satisfaction garantie</li>
            <li>Disponibilité locale</li>
          </ul>
        </section>
        <section id="quote" className="my-8">
          <h3 className="text-xl font-semibold text-gray-300">
            Demandez un devis gratuit
          </h3>
          <form className="flex flex-col items-center">
            <label className="my-2">Nom</label>
            <input
              type="text"
              name="name"
              className="border p-2 rounded bg-gray-800 text-gray-200"
            />
            <label className="my-2">E-mail</label>
            <input
              type="email"
              name="email"
              className="border p-2 rounded bg-gray-800 text-gray-200"
            />
            <label className="my-2">Numéro de téléphone</label>
            <input
              type="tel"
              name="phone"
              className="border p-2 rounded bg-gray-800 text-gray-200"
            />
            <label className="my-2">Commentaire</label>
            <textarea
              name="comment"
              className="border p-2 rounded bg-gray-800 text-gray-200"
            ></textarea>
            <button
              type="submit"
              className="bg-gray-700 text-white p-2 mt-4 rounded hover:bg-gray-600 transition duration-300"
            >
              Envoyer
            </button>
          </form>
          <p className="mt-4 text-gray-300">
            Le prix de nos devis comprend une prestation de 1 heure de
            réparation...
          </p>
        </section>
        <section id="reviews" className="my-8">
          <h3 className="text-xl font-semibold text-gray-300">Avis clients</h3>
          <div className="my-2">
            <p>
              ⭐⭐⭐⭐ Très professionnel, diagnostic rapide et réparation au
              top. Merci !
            </p>
            <p>Réponse : Myrepartout</p>
          </div>
          <div className="my-2">
            <p>
              ⭐⭐⭐ Service rapide et efficace ! Mon mixeur est comme neuf. Je
              recommande vivement !
            </p>
            <p>Réponse : Myrepartout</p>
          </div>
          <div className="my-2">
            <p>
              ⭐⭐⭐⭐ Intervention rapide et sans surprise. Mon robot culinaire
              est sauvé !
            </p>
            <p>Réponse : Myrepartout</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
