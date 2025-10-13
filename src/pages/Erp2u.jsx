import { useNavigate } from "react-router-dom";

export default function Erp2u() {
  const navigate = useNavigate();

  return (
    <div className="background-default min-h-screen">
      <img
        src="/backgrounds/secret.webp"
        alt="Background"
        className="background-image"
      />
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 bg-blue-600 text-white font-bold text-sm px-4 py-2 border-4 border-black rounded-full shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all z-50"
      >
        Vissza
      </button>
      
      <div className="relative z-10">
        <div className="flex items-center justify-center w-full min-h-screen px-4 py-12">
          <div className="w-full max-w-6xl bg-black/70 p-6 md:p-8 rounded-lg border-2 border-white shadow-lg">
            <h1 className="text-center text-2xl md:text-4xl font-bold mb-6 drop-shadow-lg text-white">
              Üdv újra kedves Tamás és Gergö!
            </h1>
            <p className="text-center text-sm text-white/80 mb-6">(vagy másik kolléga az ERP2U-tól)</p>
            
            <div className="text-base md:text-lg space-y-4 text-white leading-relaxed">
              <p>
                Szeretném megköszönni, hogy meghallgattatok a korábbi interjún! Bizom benne, hogy a leetcode-os for ciklusos csúfos leblokkolásom ellenére is sikerült jó benyomást kelltenem bennetek! Tisztában vagyok vele, hogy nem volt meggyözö a kódolási teljesítményem, de remélem ezúton meg tudom mutatni, hogy motivált vagyok és érdekel ez a pozíció!
              </p>
              
              <p>
                Lehet, hogy nem vagyok egy ninja az online coding során, föleg, ha azt figyelik, de azt garantálhatom, hogy jó velem együtt dolgozni, és nem szoktam meghátrálni bármiröl is van szó! Szeretem a kihívásokat, szeretek tanulni, és a problémák nekem arról szólnak, hogy hogyan oldjam meg öket, és nem arról, hogyan akasszanak meg.
              </p>
              
              <p>
                Tudom ezek nagy szavak, de a tettek talán többet érnek, és bízom benne, hogy ezzel is bizonyíthatom, hogy proaktív, és jól kommunikáló személység vagyok!
              </p>
              
              <p className="font-semibold">
                Remélem a jövö héten beszélünk és közösen tudjuk tovább folytatni a jövöt!
              </p>
              
              <p>
                Amennyiben ez nem így történik, akkor köszönöm a lehetöséget, és azt is, hogy rájöttem, hogy ideje jobban ráfeküdnöm a leetcoding készségeim fejlesztésére!
              </p>
              
              <p className="text-center font-bold mt-8">
                Köszönöm ha elolvastad!
              </p>
              
              <div className="text-center mt-6">
                <p className="text-lg">Üdv,</p>
                <p className="text-2xl font-bold">Tibcsó</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}