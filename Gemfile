source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.7.1'

gem 'rails', '~> 6.1.6'
gem 'pg', '~> 1.5'
gem 'puma', '~> 5.0'
gem 'sass-rails', '>= 6'
gem 'webpacker', '~> 5.0'
gem 'jbuilder', '~> 2.7'

gem 'bcrypt', '~> 3.1.7'
gem 'simple_form'
gem 'state_machines'
gem 'state_machines-activerecord'
gem 'slim-rails'
gem 'kaminari'
gem 'ransack'
gem 'responders'
gem 'webpacker-react'
gem 'active_model_serializers'
gem 'js-routes', '~>2.2.7'
gem 'dotenv-rails'
gem 'rollbar'

gem 'bootsnap', '>= 1.4.4', require: false

group :development, :test do
  gem 'factory_bot_rails'
  gem 'rubocop'
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end

group :development do
  gem 'web-console', '>= 4.1.0'
  gem 'rack-mini-profiler', '~> 2.0'
  gem 'listen', '~> 3.3'
end

group :test do
  gem 'capybara', '>= 3.26'
  gem 'selenium-webdriver', '>= 4.0.0.rc1'
  gem 'webdrivers'
  gem 'coveralls_reborn', require: false
  gem 'simplecov'
  gem 'simplecov-lcov', require: false
end

gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
