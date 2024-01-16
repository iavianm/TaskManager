require 'simplecov'

if ENV['CI']
  SimpleCov.start('rails') do
    if ENV['COVERAGE']
      require 'simplecov-lcov'

      SimpleCov::Formatter::LcovFormatter.config do |c|
        c.report_with_single_file = true
        c.single_report_path = 'coverage/lcov.info'
      end

      formatter SimpleCov::Formatter::LcovFormatter

    end

    add_filter ['version.rb', 'initializer.rb', 'config.rb']
  end
end

ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

class ActiveSupport::TestCase
  include FactoryBot::Syntax::Methods
  include AuthHelper
  include ActionMailer::TestHelper
  parallelize(workers: :number_of_processors)

  fixtures :all
end
