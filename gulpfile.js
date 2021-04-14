//подключаем модули из папки node_modules
const { src, dest, parallel, series, watch } = require('gulp');
//определяем константы которые загружаем из npm
// Подключаем browserSync для работы с хостингом
const browserSync = require('browser-sync').create();
// Подключаем gulp-imagemin для работы с изображениями
const imagemin = require('gulp-imagemin');
// Подключаем модуль gulp-newer
const newer = require('gulp-newer');     
// Подключаем модуль del
const del = require('del');
// Подключаем gulp-concat
const concat = require('gulp-concat');
// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer');
//Минификация стилей
const cleancss = require('gulp-clean-css');



// Определяем логику работы Browsersync
function browsersync() {
    browserSync.init({// Инициализация Browsersync
        server: {
            baseDir: 'app/'// Указываем папку сервера
        },
        notify: false,
    });
};

function images() {
	return src('app/images/src/**/*') // Берём все изображения из папки источника
	.pipe(newer('app/images/dest/')) // Проверяем, было ли изменено (сжато) изображение ранее
	.pipe(imagemin()) // Сжимаем и оптимизируем изображеня
	.pipe(dest('app/images/dest/')) // Выгружаем оптимизированные изображения в папку назначения
}




//функция для отслеживания измненний в файлах
function startwatch() {
// Мониторим файлы HTML на изменения
watch('app/**/*.html').on('change', browserSync.reload);
// Мониторим папку-источник изображений и выполняем images(), если есть изменения
watch('app/images/src/**/*', images);
watch('app/styles/**/*.css',styles)

}

function styles() {
    return src('app/styles/startstyle/**/*.css')
    .pipe(concat('endstyles.css')) // Конкатенируем в один файл
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
    .pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } )) // Минифицируем стили
    .pipe(dest('app/styles/endstyle')) // Выгрузим результат в папку "app/css/"
    .pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

function buildcopy() {
	return src([ // Выбираем нужные файлы
		'app/styles/startstyle/**/*.css',
		'app/images/dest/**/*',
		], { base: 'app' }) // Параметр "base" сохраняет структуру проекта при копировании
	.pipe(dest('dist')) // Выгружаем в папку с финальной сборкой
}




// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync;
// Экспорт функции images() в таск images
exports.images = images;
// Экспортируем функцию scripts() в таск scripts
exports.styles = styles;
// Создаём новый таск "build", который последовательно выполняет нужные операции
exports.build = series(styles, images, buildcopy);
// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(styles, browsersync, startwatch);
//Дефолтный таск exports.default позволяет запускать проект одной командой gulp в терминале.
//parallel() - параллельное выполнение всех перечисленных в скобках функций. 

