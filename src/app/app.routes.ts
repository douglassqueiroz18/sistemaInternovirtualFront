import { Routes } from '@angular/router';
import { PageLoader } from './components/pages/page-loader/page-loader';
import { AcessarPagina } from './components/acessar-pagina/acessar-pagina';
import { EditPage } from './components/pages/edit-page/edit-page';

export const routes: Routes = [
    {
      path: 'criar-pagina', loadComponent: () => import('./components/criar-pagina/criar-pagina').then(m => m.CriarPagina),
    },
    {
      path: 'edit/:serialKey', loadComponent: () => import('./components/pages/edit-page/edit-page').then(m => m.EditPage),
    },
    {
      path: 'page/:serialKey', loadComponent: () => import('./components/pages/page-loader/page-loader').then(m => m.PageLoader),
    },
    {
      path: 'access', loadComponent: () => import('./components/acessar-pagina/acessar-pagina').then(m => m.AcessarPagina),
    },
    {
      path: 'acessar-pagina', loadComponent: () => import('./components/acessar-pagina/acessar-pagina').then(m => m.AcessarPagina),
    },
    {
      path: 'mostrar-paginas', loadComponent: () => import('./components/mostrar-paginas/mostrar-paginas').then(m => m.MostrarPaginas),
    },
    {
      path: 'menu', loadComponent: () => import('./components/menu/menu').then(m => m.Menu),
    }
];
