require 'simplecov'

SimpleCov.start('rails') do
  require 'simplecov-lcov'

  SimpleCov::Formatter::LcovFormatter.config do |c|
    c.report_with_single_file = true
    c.single_report_path = 'coverage/lcov.info'
  end

  formatter SimpleCov::Formatter::LcovFormatter
  add_filter ['version.rb', 'initializer.rb', 'config.rb']
end

ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'sidekiq/testing'
Sidekiq::Testing.inline!

class ActiveSupport::TestCase
  include FactoryBot::Syntax::Methods
  include AuthHelper
  include ActionMailer::TestHelper
  parallelize(workers: :number_of_processors)

  fixtures :all

  def after_teardown
    super

    remove_uploaded_files
  end

  def remove_uploaded_files
    FileUtils.rm_rf(ActiveStorage::Blob.service.root)
  end
end
