'use strict'

import ViewAlcool from './ViewAlcool.js'
import ViewClean from './ViewClean.js'
import ViewImport from './ViewImport.js'
import ViewNote from './ViewNote.js'
import ViewPressure from './ViewPressure.js'
import ViewTemperature from './ViewTemperature.js'
import ViewUnit from './ViewUnit.js'
import ViewVolume from './ViewVolume.js'
import Translator from './Translator.js'

class View {
  constructor ($root) {
    this.$root = $root
  }

  getList () {
    return [
      {
        key: 'UNIT',
        label: Translator.__('ViewUnit:shortTitle'),
        description: Translator.__('ViewUnit:title'),
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="size-20 p-2 rounded bg-amber-500 group-hover:text-amber-500 group-hover:bg-transparent group-focus:text-amber-500 group-focus:bg-transparent" aria-hidden="true">
  <path d="M1 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5v-1H2v-1h4v-1H4v-1h2v-1H2v-1h4V9H4V8h2V7H2V6h4V2h1v4h1V4h1v2h1V2h1v4h1V4h1v2h1V2h1v4h1V1a1 1 0 0 0-1-1z"/>
</svg>`,
        children: [
          {
            key: 'pressure',
            label: Translator.__('ViewUnit:Pressure:shortTitle'),
            description: Translator.__('ViewUnit:Pressure:title'),
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="size-20 p-2 rounded bg-amber-500 group-hover:text-amber-500 group-hover:bg-transparent group-focus:text-amber-500 group-focus:bg-transparent" aria-hidden="true">
  <path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2M3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.39.39 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.39.39 0 0 0-.029-.518z"/>
  <path fill-rule="evenodd" d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.95 11.95 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0"/>
</svg>`
          },
          {
            key: 'volume',
            label: Translator.__('ViewUnit:Volume:shortTitle'),
            description: Translator.__('ViewUnit:Volume:title'),
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-20 p-2 rounded bg-amber-500 group-hover:text-amber-500 group-hover:bg-transparent group-focus:text-amber-500 group-focus:bg-transparent" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
</svg>`
          },
          {
            key: 'temperature',
            label: Translator.__('ViewUnit:Temperature:shortTitle'),
            description: Translator.__('ViewUnit:Temperature:title'),
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="p-2 size-20 rounded bg-amber-500 group-hover:text-amber-500 group-hover:bg-transparent group-focus:text-amber-500 group-focus:bg-transparent" aria-hidden="true">
  <path d="M9.5 12.5a1.5 1.5 0 1 1-2-1.415V2.5a.5.5 0 0 1 1 0v8.585a1.5 1.5 0 0 1 1 1.415"/>
  <path d="M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1"/>
</svg>`
          },
          {
            key: 'gravity',
            label: Translator.__('ViewUnit:Gravity:shortTitle'),
            description: Translator.__('ViewUnit:Gravity:title'),
            icon: `<svg fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 296 296" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 296 296" class="size-20 p-2 rounded bg-amber-500 group-hover:text-amber-500 group-hover:bg-transparent group-focus:text-amber-500 group-focus:bg-transparent" aria-hidden="true">
  <g>
    <g>
      <path d="m197.5,264.465v-211.797l17.333-52.668h-115.333v264.295l-67,15.705v16h115.829 0.669 114.502v-16l-66-15.535zm-16-83.465v16h-66v-16h66zm-66-17v-16h33v16h-33zm33,50v16h-33v-16h33zm33-83h-66v-16h66v16zm-33-33h-33v-16h33v16zm44.333-82h0.065l-10.301,31.947-.363,1.053h-66.734v-33h77.333z"/>
    </g>
  </g>
</svg>`
          }
        ]
      },
      {
        key: 'VOLUME',
        label: Translator.__('ViewVolume:shortTitle'),
        description: Translator.__('ViewVolume:title'),
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-20 p-2 rounded bg-amber-500 group-hover:text-amber-500 group-hover:bg-transparent group-focus:text-amber-500 group-focus:bg-transparent" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
</svg>`
      },
      {
        key: 'CLEAN',
        label: Translator.__('ViewClean:shortTitle'),
        description: Translator.__('ViewClean:title'),
        icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" class="size-20 p-2 rounded bg-amber-500 group-hover:text-amber-500 group-hover:bg-transparent group-focus:text-amber-500 group-focus:bg-transparent" aria-hidden="true" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{} </style> <g> <path class="st0" d="M509.556,206.762c0.11-2.05,0.19-4.092,0.19-6.12c0.008-30.611-11.531-58.356-30.764-78.398 c-19.204-20.064-46.234-32.426-76.422-32.405c-29.458-0.007-53.534,4.894-75.787,9.569c-22.304,4.69-42.733,9.095-66.145,9.088 c-23.412,0-43.214-4.384-64.964-9.08c-21.698-4.668-45.271-9.584-74.73-9.576c-31.406,0.008-60.412,13.245-81.943,34.345 c-21.428,20.998-35.665,49.954-37.715,82.045H1.262C1.233,206.514,0,218.577,0,236.766c0.03,24.769,2.21,60.814,13.318,94.393 c5.587,16.79,13.435,33.026,24.755,46.766c11.283,13.727,26.242,24.886,45.052,30.75c24.973,7.833,41.318,10.707,57.378,10.685 c13.158-0.015,25.419-1.795,42.303-3.662c16.914-1.881,38.685-3.96,70.952-4.814l0.627-0.014l-0.605,0.014 c1.437-0.036,2.881-0.058,4.34-0.058c17.636-0.008,36.686,2.706,56.686,5.557c20.006,2.83,40.968,5.77,62.615,5.777 c12.611,0,25.469-1.014,38.444-3.684c20.86-4.259,37.86-13.865,50.953-26.578c19.693-19.102,30.756-44.578,37.138-70.113 c6.36-25.586,8.038-51.492,8.045-72.352C512,227.248,510.074,210.794,509.556,206.762z M19.853,208.139l0.007-0.32l3.727,0.226 c1.584-26.446,13.348-50.478,31.086-67.859c17.76-17.381,41.252-27.949,66.261-27.941c26.964,0.007,48.393,4.42,70.011,9.08 c21.567,4.632,43.404,9.576,69.682,9.576c26.278-0.007,48.611-4.93,70.747-9.569c22.18-4.66,44.221-9.08,71.185-9.088 c24.069,0.022,45.024,9.664,60.244,25.505c15.193,15.856,24.521,37.912,24.536,62.892c0,2.006-0.066,4.019-0.182,6.068 l-0.066,1.116l0.153,1.109l0.022,0.138c0.117,0.868,0.759,5.923,1.334,13.719c-4.521,21.064-15.17,39.99-29.925,54.439 c-18.387,18.008-42.798,29.014-68.88,29.014c-27.38-0.008-49.159-4.5-70.792-9.161c-21.596-4.646-43.09-9.496-68.895-9.496 c-25.804,0-47.816,4.843-69.982,9.489c-22.194,4.661-44.578,9.168-71.951,9.168c-25.082-0.015-47.05-10.116-62.936-26.658 c-11.006-11.48-18.942-26.111-22.836-42.616v-0.205c0-8.584,0.292-15.718,0.584-20.669c0.146-2.48,0.284-4.406,0.394-5.704 l0.124-1.445l0.044-0.43L19.853,208.139z M475.072,338.723c-5.747,14.332-13.544,27.132-23.835,37.08 c-10.32,9.949-23.062,17.235-39.896,20.736c-11.196,2.298-22.501,3.217-33.922,3.217c-19.598,0.008-39.516-2.721-59.472-5.558 c-19.955-2.815-39.939-5.762-59.829-5.776c-1.648,0-3.311,0.022-4.974,0.066l-0.306,0.014c-32.755,0.868-55.322,3.013-72.512,4.931 c-17.264,1.933-28.875,3.537-39.823,3.523c-13.296-0.022-26.65-2.166-50.682-9.664c-14.368-4.522-25.41-12.691-34.462-23.616 c-13.537-16.345-22.056-39.195-26.87-62.506c-1.619-7.768-2.8-15.55-3.705-23.15c2.968,4.186,6.141,8.22,9.671,11.903 c18.54,19.364,44.556,31.275,73.723,31.26c29.043,0,52.776-4.821,75.021-9.489c22.275-4.683,43.018-9.168,66.911-9.168 s44.031,4.478,65.752,9.161c21.684,4.668,44.892,9.496,73.935,9.496c30.341-0.008,58.436-12.8,79.331-33.281 c7.812-7.651,14.631-16.396,20.218-25.972C488.485,285.984,484.868,314.435,475.072,338.723z"></path> <path class="st0" d="M69.566,192.334c4.872,3.501,11.305,5.536,18.344,5.543c7.038-0.008,13.471-2.042,18.335-5.543 c4.836-3.465,8.235-8.664,8.235-14.674c0-6.017-3.399-11.225-8.235-14.696c-4.872-3.508-11.304-5.536-18.335-5.543 c-7.038,0.007-13.472,2.035-18.344,5.543c-4.836,3.471-8.234,8.679-8.234,14.696C61.332,183.67,64.73,188.87,69.566,192.334z M73.942,169.017c3.399-2.472,8.388-4.136,13.968-4.128c5.579-0.008,10.56,1.656,13.959,4.128c3.428,2.502,5.142,5.543,5.142,8.643 c0,3.078-1.714,6.119-5.142,8.621c-3.399,2.464-8.388,4.135-13.959,4.128c-5.58,0.008-10.569-1.663-13.968-4.128 c-3.427-2.502-5.141-5.543-5.141-8.621C68.801,174.56,70.515,171.519,73.942,169.017z"></path> <path class="st0" d="M154.959,178.688c4.872,3.508,11.305,5.536,18.343,5.543c7.038-0.007,13.472-2.035,18.336-5.543 c4.843-3.472,8.242-8.672,8.242-14.689c0-6.017-3.399-11.225-8.242-14.696c-4.864-3.508-11.298-5.536-18.336-5.543 c-7.038,0.007-13.471,2.035-18.343,5.543c-4.843,3.471-8.242,8.679-8.242,14.696C146.718,170.016,150.123,175.216,154.959,178.688z M159.335,155.356c3.399-2.465,8.396-4.136,13.967-4.128c5.572-0.008,10.561,1.663,13.968,4.128 c3.427,2.502,5.142,5.55,5.142,8.643c0,3.085-1.714,6.134-5.142,8.635c-3.406,2.466-8.396,4.136-13.968,4.129 c-5.572,0.007-10.568-1.663-13.967-4.129c-3.435-2.501-5.149-5.55-5.149-8.635C154.186,160.906,155.907,157.858,159.335,155.356z"></path> <path class="st0" d="M97.938,254.446c0,7.089,4.004,13.26,9.817,17.432c5.842,4.208,13.617,6.674,22.129,6.68 c8.526-0.007,16.308-2.472,22.143-6.68c5.82-4.172,9.818-10.343,9.818-17.432s-3.997-13.26-9.818-17.432 c-5.834-4.208-13.617-6.673-22.143-6.681c-8.512,0.008-16.287,2.473-22.129,6.681C101.942,241.186,97.938,247.357,97.938,254.446z M112.131,243.068c4.369-3.172,10.7-5.274,17.753-5.266c7.068-0.008,13.398,2.094,17.774,5.266 c4.398,3.202,6.717,7.221,6.717,11.378c0,4.158-2.32,8.176-6.717,11.378c-4.376,3.173-10.707,5.273-17.774,5.266 c-7.053,0.007-13.384-2.093-17.753-5.266c-4.405-3.202-6.725-7.22-6.725-11.378C105.406,250.289,107.726,246.27,112.131,243.068z"></path> <path class="st0" d="M225.918,249.48c4.675,3.362,10.845,5.309,17.592,5.317c6.754-0.008,12.931-1.954,17.614-5.317 c4.646-3.333,7.928-8.352,7.928-14.157c0-5.806-3.275-10.824-7.928-14.164c-4.683-3.37-10.86-5.317-17.614-5.324 c-6.747,0.007-12.917,1.954-17.592,5.324c-4.654,3.34-7.936,8.351-7.936,14.164C217.982,241.128,221.264,246.146,225.918,249.48z M230.294,227.212c3.209-2.334,7.935-3.916,13.216-3.909c5.302-0.007,10.028,1.575,13.238,3.909 c3.238,2.363,4.836,5.223,4.836,8.111c0,2.881-1.597,5.733-4.836,8.096c-3.209,2.334-7.935,3.916-13.238,3.909 c-5.281,0.007-10.007-1.575-13.223-3.909c-3.238-2.363-4.836-5.215-4.836-8.096C225.451,232.435,227.048,229.575,230.294,227.212z"></path> <path class="st0" d="M292.202,198.453c6.302,4.537,14.711,7.207,23.93,7.214c9.219-0.007,17.636-2.677,23.938-7.214 c6.265-4.5,10.553-11.13,10.553-18.722c0-7.593-4.281-14.23-10.553-18.73c-6.302-4.544-14.718-7.213-23.938-7.221 c-9.219,0.008-17.628,2.677-23.93,7.221c-6.272,4.5-10.554,11.137-10.554,18.73C281.648,187.324,285.929,193.954,292.202,198.453z M296.578,167.055c4.828-3.508,11.794-5.813,19.554-5.806c7.76-0.007,14.733,2.298,19.561,5.806 c4.858,3.53,7.462,8.008,7.462,12.676c0,4.66-2.604,9.132-7.462,12.669c-4.828,3.501-11.801,5.806-19.561,5.799 c-7.76,0.007-14.726-2.298-19.554-5.799c-4.865-3.537-7.461-8.008-7.461-12.669C289.116,175.063,291.72,170.585,296.578,167.055z"></path> <path class="st0" d="M366.326,252.244c5.011,3.603,11.64,5.696,18.89,5.704c7.25-0.008,13.872-2.101,18.883-5.704 c4.974-3.574,8.46-8.92,8.46-15.09c0-6.17-3.486-11.516-8.46-15.09c-5.011-3.603-11.633-5.689-18.883-5.696 c-7.25,0.008-13.88,2.094-18.89,5.696c-4.974,3.574-8.46,8.92-8.46,15.09C357.866,243.324,361.352,248.67,366.326,252.244z M370.702,228.116c3.537-2.56,8.716-4.288,14.514-4.281c5.791-0.007,10.969,1.722,14.507,4.281 c3.566,2.604,5.368,5.784,5.368,9.037c0,3.246-1.801,6.433-5.368,9.037c-3.538,2.567-8.716,4.295-14.507,4.288 c-5.799,0.007-10.978-1.722-14.514-4.288c-3.566-2.604-5.368-5.791-5.368-9.037C365.334,233.9,367.136,230.721,370.702,228.116z"></path> <path class="st0" d="M403.392,175.516c5.185,3.727,12.056,5.9,19.576,5.908c7.512-0.008,14.382-2.181,19.561-5.908 c5.156-3.698,8.752-9.219,8.752-15.58c0-6.367-3.596-11.888-8.752-15.586c-5.179-3.734-12.049-5.9-19.561-5.908 c-7.512,0.008-14.39,2.174-19.576,5.908c-5.164,3.698-8.768,9.212-8.768,15.586C394.624,166.304,398.228,171.818,403.392,175.516z M407.76,150.404c3.72-2.692,9.146-4.501,15.207-4.493c6.054-0.008,11.473,1.801,15.192,4.493c3.742,2.727,5.653,6.09,5.653,9.532 c0,3.436-1.911,6.79-5.653,9.526c-3.719,2.692-9.138,4.5-15.192,4.493c-6.054,0.008-11.487-1.801-15.207-4.5 c-3.756-2.728-5.667-6.09-5.667-9.518C402.093,156.494,404.004,153.139,407.76,150.404z"></path> </g> </g></svg>'
      },
      {
        key: 'ALCOOL',
        label: Translator.__('ViewAlcool:shortTitle'),
        description: Translator.__('ViewAlcool:title'),
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" class="size-20 rounded bg-amber-500 group-hover:text-amber-500 group-hover:bg-transparent group-focus:text-amber-500 group-focus:bg-transparent" aria-hidden="true">
  <path d="M13.442 2.558a.625.625 0 0 1 0 .884l-10 10a.625.625 0 1 1-.884-.884l10-10a.625.625 0 0 1 .884 0M4.5 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5m7 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
</svg>`,
        children: [
          {
            key: 'densimeter',
            label: Translator.__('ViewAlcool:Densimeter:shortTitle'),
            description: Translator.__('ViewAlcool:Densimeter:title'),
            icon: `<svg fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 296 296" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 296 296" class="size-20 p-2 rounded bg-amber-500 group-hover:text-amber-500 group-hover:bg-transparent group-focus:text-amber-500 group-focus:bg-transparent" aria-hidden="true">
  <g>
    <g>
      <path d="m197.5,264.465v-211.797l17.333-52.668h-115.333v264.295l-67,15.705v16h115.829 0.669 114.502v-16l-66-15.535zm-16-83.465v16h-66v-16h66zm-66-17v-16h33v16h-33zm33,50v16h-33v-16h33zm33-83h-66v-16h66v16zm-33-33h-33v-16h33v16zm44.333-82h0.065l-10.301,31.947-.363,1.053h-66.734v-33h77.333z"/>
    </g>
  </g>
</svg>`
          },
          {
            key: 'refractometer',
            label: Translator.__('ViewAlcool:Refractometer:shortTitle'),
            description: Translator.__('ViewAlcool:Refractometer:title'),
            icon: `<svg fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
  viewBox="0 0 260 260" enable-background="new 0 0 260 260" xml:space="preserve"  class="size-20 p-2 rounded bg-amber-500 group-hover:text-amber-500 group-hover:bg-transparent group-focus:text-amber-500 group-focus:bg-transparent" aria-hidden="true">
<path d="M186.662,212.515l-52.247-52.247l25.853-25.853l52.247,52.247l0.101,25.954L186.662,212.515z M258,243.369l-21.847-21.847
  l-0.173-44.632L117.796,58.698l14.771-14.771l-22.16-22.16L95.563,36.611l-22.23-22.23c-16.319-16.318-42.776-16.318-59.094,0
  c-16.318,16.319-16.318,42.776,0,59.094L36.5,95.674l-14.733,14.733l22.16,22.16l14.771-14.771L176.89,235.98l44.346,0.172
  l21.99,21.99L258,243.369z M69.777,106.717l36.94-36.94L220.34,183.4l0.14,37.08l-37.08-0.14L69.777,106.717z"/>
</svg>`
          }
        ]
      },
      {
        key: 'TEMPERATURE',
        label: Translator.__('ViewTemperature:shortTitle'),
        description: Translator.__('ViewTemperature:title'),
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="p-2 size-20 rounded bg-amber-500 group-hover:text-amber-500 group-hover:bg-transparent group-focus:text-amber-500 group-focus:bg-transparent" aria-hidden="true">
  <path d="M9.5 12.5a1.5 1.5 0 1 1-2-1.415V2.5a.5.5 0 0 1 1 0v8.585a1.5 1.5 0 0 1 1 1.415"/>
  <path d="M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1"/>
</svg>`
      },
      {
        key: 'PRESSURE',
        label: Translator.__('ViewPressure:shortTitle'),
        description: Translator.__('ViewPressure:title'),
        icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 511.932 511.932" xml:space="preserve" fill="currentColor" class="size-20 rounded bg-amber-500 group-hover:text-amber-500 group-hover:bg-transparent group-focus:text-amber-500 group-focus:bg-transparent p-2" aria-hidden="true"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M419.55,1.328c-0.756-0.82-1.82-1.284-2.936-1.284L96.234,0c-1.116,0-2.18,0.464-2.94,1.284 c-0.756,0.82-2.056,1.92-1.968,3.036l8.984,123.64v0.008c0,0,0,0.008,0,0.012l30.096,364.272 c0.864,10.828,11.32,19.68,22.18,19.68h207.9c10.856,0,20.396-8.852,21.256-19.68L420.598,4.376 C420.686,3.268,420.306,2.148,419.55,1.328z M168.714,167.956c0-6.476,5.252-11.732,11.736-11.732 c6.476,0,11.732,5.252,11.732,11.732s-5.252,11.736-11.732,11.736C173.966,179.688,168.714,174.436,168.714,167.956z M172.442,231.916c0-1.244,0.288-2.468,0.844-3.58c1.356-2.712,4.148-4.44,7.176-4.44c2.12,0,4.176,0.852,5.676,2.352 c1.984,1.984,2.784,4.868,2.104,7.592c-0.892,3.564-4.108,6.092-7.78,6.092C176.046,239.936,172.442,236.336,172.442,231.916z M200.434,381.716c-0.892,3.564-4.108,6.092-7.78,6.092c-4.416,0-8.02-3.6-8.02-8.02c0-1.016,0.196-2.024,0.572-2.968 c1.216-3.04,4.18-5.052,7.448-5.052c2.12,0,4.176,0.852,5.676,2.352C200.314,376.108,201.114,378.992,200.434,381.716z M212.094,302.296c-1.044,3.336-4.156,5.64-7.656,5.64c-4.416,0-8.016-3.6-8.016-8.02c0-1.016,0.192-2.02,0.572-2.964 c1.216-3.044,4.176-5.056,7.444-5.056c1.816,0,3.596,0.624,5.016,1.756C212.03,295.712,213.078,299.144,212.094,302.296z M220.278,219.424c-6.48,0-11.736-5.252-11.736-11.736c0-6.476,5.252-11.732,11.736-11.732c6.484,0,11.732,5.252,11.732,11.732 C232.01,214.172,226.758,219.424,220.278,219.424z M236.466,252.12c0-1.016,0.196-2.024,0.572-2.968 c1.216-3.04,4.176-5.052,7.448-5.052c2.12,0,4.172,0.852,5.672,2.352c1.988,1.984,2.784,4.868,2.104,7.592 c-0.888,3.564-4.104,6.092-7.776,6.092C240.066,260.14,236.466,256.536,236.466,252.12z M264.134,354.02 c-0.98,3.432-4.136,5.832-7.712,5.832c-4.416,0-8.02-3.6-8.02-8.02c0-1.244,0.288-2.468,0.844-3.58 c1.356-2.712,4.144-4.436,7.176-4.436c2.12,0,4.172,0.852,5.672,2.352C264.15,348.224,264.93,351.228,264.134,354.02z M288.322,326.136c-0.98,3.436-4.136,5.836-7.712,5.836c-4.416,0-8.02-3.6-8.02-8.02c0-1.244,0.292-2.468,0.844-3.58 c1.356-2.712,4.144-4.436,7.176-4.436c2.12,0,4.172,0.852,5.672,2.352C288.338,320.34,289.118,323.348,288.322,326.136z M273.21,164.268c0-1.016,0.196-2.024,0.572-2.968c1.216-3.04,4.176-5.052,7.448-5.052c2.12,0,4.172,0.852,5.672,2.352 c1.988,1.984,2.784,4.868,2.104,7.592c-0.888,3.564-4.104,6.092-7.776,6.092C276.81,172.288,273.21,168.684,273.21,164.268z M296.686,277.732c-0.752,3.74-4.044,6.444-7.852,6.444c-4.416,0-8.012-3.592-8.012-8.012c0-0.864,0.136-1.72,0.416-2.54 c1.088-3.26,4.156-5.472,7.596-5.472c2.12,0,4.164,0.848,5.664,2.348C296.394,272.392,297.214,275.108,296.686,277.732z M288.178,231.932c-6.48,0-11.732-5.252-11.732-11.732s5.248-11.736,11.732-11.736s11.736,5.252,11.736,11.736 C299.91,226.68,294.658,231.932,288.178,231.932z M340.594,289.844c-0.892,3.564-4.108,6.092-7.78,6.092 c-4.416,0-8.016-3.6-8.016-8.02c0-1.016,0.192-2.024,0.572-2.968c1.216-3.04,4.176-5.052,7.444-5.052 c2.12,0,4.176,0.852,5.676,2.352C340.474,284.232,341.274,287.116,340.594,289.844z M340.43,203.704 c-6.48,0-11.736-5.252-11.736-11.736s5.252-11.732,11.736-11.732c6.484,0,11.736,5.248,11.736,11.732 S346.91,203.704,340.43,203.704z M387.15,122.016c-2.832,1.052-6.1,1.78-11.136,1.78c-7.652,0-11.244-1.68-15.396-3.62 c-4.384-2.056-9.348-4.38-18.784-4.38c-9.436,0-14.408,2.324-18.788,4.38c-4.152,1.94-7.744,3.62-15.404,3.62 c-7.652,0-11.244-1.68-15.396-3.62c-4.384-2.056-9.348-4.38-18.784-4.38c-9.432,0-14.4,2.324-18.78,4.38 c-4.152,1.94-7.74,3.62-15.392,3.62s-11.236-1.68-15.388-3.62c-4.384-2.056-9.348-4.38-18.78-4.38s-14.4,2.324-18.78,4.38 c-4.152,1.94-7.74,3.62-15.392,3.62c-7.652,0-11.24-1.68-15.388-3.62c-4.384-2.056-9.352-4.38-18.784-4.38 c-4.784,0-8.416,0.6-11.408,1.456l-7.472-93.248l277.056,0.04L387.15,122.016z"></path> </g> </g> </g></svg>'
      },
      {
        key: 'NOTE',
        label: Translator.__('ViewNote:shortTitle'),
        description: Translator.__('ViewNote:title'),
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="size-20 p-2 rounded bg-amber-500 group-hover:text-amber-500 group-hover:bg-transparent group-focus:text-amber-500 group-focus:bg-transparent" aria-hidden="true">
  <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
  <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
  <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
</svg>`
      },
      {
        key: 'IMPORT',
        label: Translator.__('ViewImport:shortTitle'),
        description: Translator.__('ViewImport:title'),
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="size-20 p-2 rounded bg-amber-500 group-hover:text-amber-500 group-hover:bg-transparent group-focus:text-amber-500 group-focus:bg-transparent" aria-hidden="true">
  <path d="M8.5 1.5A1.5 1.5 0 0 1 10 0h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h6c-.314.418-.5.937-.5 1.5v6h-2a.5.5 0 0 0-.354.854l2.5 2.5a.5.5 0 0 0 .708 0l2.5-2.5A.5.5 0 0 0 10.5 7.5h-2z"/>
</svg>`
      }/*,
      {
        key: 'CELLS',
        label: Translator.__('ViewCells:shortTitle'),
        description: Translator.__('ViewCells:title'),
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-20 rounded bg-amber-500 group-hover:text-amber-500 group-hover:bg-transparent group-focus:text-amber-500 group-focus:bg-transparent" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
</svg>`
      },
      {
        key: 'SUGAR',
        label: Translator.__('ViewSugar:shortTitle'),
        description: Translator.__('ViewSugar:title'),
        icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="currentColor" class="size-20 rounded bg-amber-500 group-hover:text-amber-500 group-hover:bg-transparent group-focus:text-amber-500 group-focus:bg-transparent p-2" aria-hidden="true"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M511.492,288.022c-1.055-4.082-3.69-7.576-7.322-9.715l-144.826-85.284V17.37c0-8.778-7.117-15.895-15.895-15.895H108.304 c-8.778,0-15.895,7.117-15.895,15.895v219.748H15.895C7.117,237.118,0,244.235,0,253.013v235.145 c0,8.778,7.117,15.895,15.895,15.895H251.04c8.778,0,15.895-7.117,15.895-15.895v-39.771l101.784,59.938 c2.533,1.491,5.31,2.2,8.051,2.2c5.445,0,10.748-2.801,13.711-7.832l119.321-202.624 C511.941,296.437,512.549,292.103,511.492,288.022z M235.145,472.264H31.79V268.908h203.355V472.264z M237.382,236.619H124.199 V33.265h203.355v141.038l-26.009-15.316c-3.634-2.139-7.967-2.748-12.047-1.691c-4.082,1.055-7.576,3.69-9.715,7.322 L237.382,236.619z M371.153,472.867l-104.219-61.372V253.013h0.001c0-1.141-0.126-2.253-0.355-3.326l32.529-55.24l175.232,103.189 L371.153,472.867z"></path> </g> </g> </g></svg>'
      },
      {
        key: 'OTHER',
        label: Translator.__('ViewAlcool:shortTitle'),
        description: Translator.__('ViewAlcool:title'),
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-20 rounded bg-amber-500 group-hover:text-amber-500 group-hover:bg-transparent group-focus:text-amber-500 group-focus:bg-transparent" aria-hidden="true">
   <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
</svg>`
      }
      */
    ]
  }

  set (view, subview) {
    this.load(view, subview)
  }

  get () {
    const view = localStorage.getItem('view') // eslint-disable-line no-undef

    if (!view) {
      return this.getList()[0].key
    }

    return view
  }

  load (view, subview) {
    if (!view) {
      view = this.get()
      subview = localStorage.getItem('subview') // eslint-disable-line no-undef
    }

    switch (view) {
      case 'UNIT':
        this.currentViewInstance = new ViewUnit(
          this.$root,
          subview
        )
        break
      case 'VOLUME':
        this.currentViewInstance = new ViewVolume(
          this.$root
        )
        break
      case 'CLEAN':
        this.currentViewInstance = new ViewClean(
          this.$root
        )
        break
      case 'ALCOOL':
        this.currentViewInstance = new ViewAlcool(
          this.$root,
          subview
        )
        break
      case 'TEMPERATURE':
        this.currentViewInstance = new ViewTemperature(
          this.$root
        )
        break
      case 'PRESSURE':
        this.currentViewInstance = new ViewPressure(
          this.$root
        )
        break
      case 'NOTE':
        this.currentViewInstance = new ViewNote(
          this.$root
        )
        break
      case 'IMPORT':
        this.currentViewInstance = new ViewImport(
          this.$root
        )
        break
      default:
        throw new Error(`Unknow view ${view}`)
    }

    localStorage.setItem('view', view) // eslint-disable-line no-undef
    localStorage.setItem('subview', subview) // eslint-disable-line no-undef
  }
}

export default View
