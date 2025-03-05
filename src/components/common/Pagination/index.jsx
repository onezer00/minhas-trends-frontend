import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './styles.css';

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  totalItems,
  onItemsPerPageChange
}) {
  // Gerar array de páginas para exibição
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Número máximo de botões de página para mostrar
    
    if (totalPages <= maxPagesToShow) {
      // Se tivermos menos páginas que o máximo, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Caso contrário, mostrar páginas com elipses
      if (currentPage <= 3) {
        // Caso 1: Página atual próxima ao início
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Caso 2: Página atual próxima ao fim
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Caso 3: Página atual no meio
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Opções de itens por página
  const itemsPerPageOptions = [9, 18, 27];

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span>
          Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} itens
        </span>
        <div className="items-per-page">
          <label htmlFor="itemsPerPage">Itens por página:</label>
          <select 
            id="itemsPerPage" 
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="items-per-page-select"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="pagination-controls">
        <button 
          className="pagination-button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          <ChevronLeft size={18} />
        </button>
        
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
          ) : (
            <button
              key={page}
              className={`pagination-button ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-label={`Página ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        ))}
        
        <button 
          className="pagination-button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Próxima página"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
} 