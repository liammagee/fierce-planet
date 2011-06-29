class WorldController < ApplicationController
  def open
    @level = Level.new
    flash[:notice] = "Opening Level 1..."
  end

end
