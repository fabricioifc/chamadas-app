import Classe from "./Classe";

interface Chamada {
    id: number;
    created_at: string;
    dtaula: any;
    hrini: any;
    hrfim: any;
    qtde: number;
    
    classe_id: number;
    classes: any
}

export default Chamada;