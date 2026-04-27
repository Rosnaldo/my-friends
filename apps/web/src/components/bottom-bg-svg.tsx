import { useIsMobile } from "@/hooks/useIsMobile";
import { Sacura } from "./sacura";

export function BottomBgSvg() {
    const isMobile = useIsMobile()

    return (
        <div id="bottom-bg-svg" className="absolute bottom-0 left-0 w-full h-[135vh] z-0 pointer-events-none overflow-hidden">
            <Sacura />

            <svg className="w-full h-full absolute top-0 left-0">
                {/* <!-- hills suaves neutros --> */}
                <ellipse cx="200" cy="1000" rx="420" ry="190" fill="#e0d8c8" opacity=".5"/>
                <ellipse cx="900" cy="1020" rx="650" ry="210" fill="#d8d0c0" opacity=".35"/>
                <ellipse cx="1300" cy="1080" rx="380" ry="170" fill="#ddd5c5" opacity=".4"/>


                {/* <!-- === ELEMENTOS AZUIS === --> */}
                {/* <!-- bolinha azul topo esq --> */}
                <circle cx="320" cy="300" r="28" fill="#b8cce8" opacity=".35"/>
                <circle cx="320" cy="300" r="18" fill="#9ab8e0" opacity=".2"/>

                {/* <!-- arco azul meio dir --> */}
                <path d="M1220 350 Q1280 280 1340 350" fill="none" stroke="#7a9acc" strokeWidth="3" opacity=".35" strokeLinecap="round"/>
                <path d="M1230 370 Q1290 300 1350 370" fill="none" stroke="#9ab8e0" strokeWidth="2" opacity=".25" strokeLinecap="round"/>

                {/* <!-- === ELEMENTOS LILÁS / ROXO === --> */}
                {/* <!-- bolinha lilás dir alto --> */}
                <circle cx="1050" cy="450" r="36" fill="#c8b8e8" opacity=".3"/>
                <circle cx="1050" cy="450" r="22" fill="#b0a0d8" opacity=".2"/>

                {/* <!-- === ELEMENTOS PRETOS (linhas finas elegantes) === --> */}
                {/* <!-- linha diagonal preta suave topo --> */}
                <line x1="430" y1="20" x2="520" y2="110" stroke="#2e2820" strokeWidth="1" opacity=".1" strokeLinecap="round"/>
                <line x1="445" y1="20" x2="535" y2="110" stroke="#2e2820" strokeWidth="1" opacity=".07" strokeLinecap="round"/>
                {/* <!-- pontinho preto trio esq --> */}
                <circle cx="190" cy="320" r="4" fill="#2e2820" opacity=".15"/>
                <circle cx="204" cy="312" r="3" fill="#2e2820" opacity=".12"/>
                <circle cx="196" cy="332" r="2.5" fill="#2e2820" opacity=".1"/>
                {/* <!-- pontinho preto dir baixo --> */}
                <circle cx="1150" cy="580" r="4.5" fill="#2e2820" opacity=".14"/>
                <circle cx="1164" cy="570" r="3" fill="#2e2820" opacity=".1"/>
                {/* <!-- linha ondulada preta suave centro baixo --> */}
                <path d="M580 860 Q620 848 660 860 Q700 872 740 860" fill="none" stroke="#2e2820" strokeWidth="1.2" opacity=".1" strokeLinecap="round"/>
            </svg>
        </div>
    )
}
