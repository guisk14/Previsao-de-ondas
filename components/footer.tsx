import { Waves } from "lucide-react"

export function Footer() {
  return (
    <footer id="sobre" className="border-t border-border bg-card py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Waves className="h-6 w-6 text-primary" />
              <span className="text-lg font-mono font-bold text-card-foreground">OndaViva</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Previsao detalhada das ondas para as melhores praias de Portugal.
              Dados atualizados para surfistas e amantes do oceano.
            </p>
          </div>

          <div>
            <h4 className="font-mono font-bold text-card-foreground mb-3">Praias Populares</h4>
            <ul className="flex flex-col gap-2">
              <li className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Supertubos, Peniche
              </li>
              <li className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                {"Ribeira d'Ilhas, Ericeira"}
              </li>
              <li className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Praia do Norte, Nazare
              </li>
              <li className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Praia do Tonel, Sagres
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-bold text-card-foreground mb-3">Informacoes</h4>
            <ul className="flex flex-col gap-2">
              <li className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Sobre nos
              </li>
              <li className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Como funcionam as previsoes
              </li>
              <li className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Contacto
              </li>
              <li className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Termos e Condicoes
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            OndaViva 2026. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Dados meramente indicativos. Consulte sempre fontes oficiais.
          </p>
        </div>
      </div>
    </footer>
  )
}
