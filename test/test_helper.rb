require 'simplecov'

SimpleCov.start('rails') do
  require 'simplecov-lcov'

  formatter SimpleCov::Formatter::LcovFormatter

  SimpleCov::Formatter::LcovFormatter.config do |c|
    c.report_with_single_file = true
    c.output_directory = 'coverage'
  end

  add_filter ['version.rb', 'initializer.rb']
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
