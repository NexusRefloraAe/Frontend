// import React, { useState } from 'react'; 
// import './ConfigSistema.css'; 
// import iconeSol from '../../assets/sol.svg'; 
// import iconeLua from '../../assets/lua.svg'; 
// import iconeNotificacaoLigada from '../../assets/clickon.svg'; 
// import iconeNotificacaoDesligada from '../../assets/cliqueoff.svg'; 

// const ConfigSistema = () => {
//     const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
//     const [localizacaoAtiva, setLocalizacaoAtiva] = useState(false); 
//     const [temaAtivo, setTemaAtivo] = useState('claro');
//     const [tamanhoFonte, setTamanhoFonte] = useState('16');

//     const iconeLocalizacaoAtual = localizacaoAtiva ? iconeNotificacaoLigada : iconeNotificacaoDesligada;
//     const iconeNotificacaoAtual = notificacoesAtivas ? iconeNotificacaoLigada : iconeNotificacaoDesligada;

//     const toggleNotificacoes = () => setNotificacoesAtivas(!notificacoesAtivas);
//     const toggleLocalizacao = () => setLocalizacaoAtiva(!localizacaoAtiva);
    
//     const handleTemaClick = (tema) => {
//         setTemaAtivo(tema);
//         console.log(`Tema alterado para: ${tema}`);
//     };

//     const handleTamanhoFonteChange = (e) => {
//         const value = e.target.value.replace(/[^0-9]/g, ''); 
//         setTamanhoFonte(value);
//     };

//     return (
//         <div className="secao-configSistema">
//             <h2 className="secao-configSistema__titulo">Personalizar</h2>
            
//             <ul className="lista-configSistema">
           
//                 <li className="item-configSistema">
//                     <span className="rotulo-configSistema">Tema claro/escuro</span>
//                     <div className="controles-configSistema">
                 
//                         <img 
//                             src={iconeSol} 
//                             alt="Tema Claro" 
//                             className={`icone-clicavel ${temaAtivo === 'claro' ? 'active' : 'inactive'}`}
//                             onClick={() => handleTemaClick('claro')}
//                             style={{ opacity: temaAtivo === 'claro' ? 1.0 : 0.4 }} 
//                         />
              
//                         <img 
//                             src={iconeLua} 
//                             alt="Tema Escuro"
//                             className={`icone-clicavel ${temaAtivo === 'escuro' ? 'active' : 'inactive'}`}
//                             onClick={() => handleTemaClick('escuro')}
//                             style={{ opacity: temaAtivo === 'escuro' ? 1.0 : 0.4 }} 
//                         />
//                     </div>
//                 </li>

//                 <li className="item-configSistema">
//                     <span className="rotulo-configuracao">Notificações</span>
//                     <div className="controles-configSistema">
//                         <img 
//                             src={iconeNotificacaoAtual} 
//                             alt="Status Notificações" 
//                             className="icone-clicavel"
//                             onClick={toggleNotificacoes}
//                         />
//                     </div>
//                 </li>

//                 <li className="item-configSistema">
//                     <span className="rotulo-configSistema">Tamanho da Fonte</span>
//                     <div className="controles-configSistema">
//                         <input
//                             type="text"
//                             className="input-fonte"
//                             value={tamanhoFonte}
//                             onChange={handleTamanhoFonteChange}
//                             placeholder=" "
//                         />
//                     </div>
//                 </li>

//                 <li className="item-configSistema">
//                     <span className="rotulo-configSistema">Localização</span>
//                     <div className="controles-configSistema">
//                         <img 
//                             src={iconeLocalizacaoAtual} 
//                             alt="Status Localização" 
//                             className="icone-clicavel"
//                             onClick={toggleLocalizacao}
//                         />
//                     </div>
//                 </li>
//             </ul>
//         </div>
//     );
// };

// export default ConfigSistema;