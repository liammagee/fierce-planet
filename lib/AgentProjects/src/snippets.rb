# Pseudo random number generator
# From: http://gnuvince.wordpress.com/2005/11/24/pseudo-random-number-generator
# Author: Vincent Foley-Bourgon

def random_number
  t = Time.now.to_f / (Time.now.to_f % Time.now.to_i)
  random_seed = t * 1103515245 + 12345;
  (random_seed / 65536) % 32768;
end

10.times { puts random_number }

cnt = Array.new(10,0)
20000.times { cnt[(random_number % 10).to_i] += 1 }
p cnt
puts


# Ruby Gaussian Random Number Generator
# Author: Glenn
# http://webhost101.net/rails/typo/articles/2007/07/31/ruby-gaussian-random-number-generator

def gaussian_rand
   u1 = u2 = w = g1 = g2 = 0  # declare
   begin
     u1 = 2 * rand - 1
     u2 = 2 * rand - 1
     w = u1 * u1 + u2 * u2
   end while w >= 1

   w = Math::sqrt( ( -2 * Math::log(w)) / w )
   g2 = u1 * w;
   g1 = u2 * w;
   # g1 is returned
end

sum = 0
sumsq = 0
n = 1000
0.upto(n) do
  #r = gaussian_rand
  r = gaussian_rand * 100 + 50   # new_random_number = gaussian_rand * standard_deviation + average
  #puts r
  sum += r
  sumsq += (r*r)
end

ave = sum/n
stddev = Math::sqrt(sumsq/n - ave * ave)
puts "Average = #{ave}"
puts "StdDev = #{stddev}"
puts


# Random Number Generator
# http://scutigena.sourceforge.net/test-random.html
# http://scutigena.sourceforge.net/sources/ruby-1.7.2/random.html
# $Id: random.ruby,v 1.2 2003/12/30 01:25:05 davidw Exp $

IM = 139968
IA = 3877
IC = 29573

$last = 42.0
def gen_random (max) (max * ($last = ($last * IA + IC) % IM)) / IM end

10.times do
    puts gen_random(100000.0)
end

printf "%.5f\n", gen_random(100.0)
puts


# From: http://matt.blogs.it/entries/00002641.html
# Author: Matt Mower
# cf. http://www.taygeta.com/random/gaussian.html
# cf. http://www.bearcave.com/misl/misl_tech/wavelets/hurst/random.html

def box_mueller( mean = 0.0, stddev = 1.0 )
  x1 = 0.0, x2 = 0.0, w = 0.0

  until w > 0.0 && w < 1.0
    x1 = 2.0 * rand - 1.0
    x2 = 2.0 * rand - 1.0
    w = ( x1 * x2 ) + ( x2 * x2 )
  end

  w = Math.sqrt( -2.0 * Math.log( w ) / w )
  r = x1 * w

  mean + r * stddev
end

10.times { puts box_mueller(5.0, 1.0) }
puts


# Generating random numbers with a specified distribution
# From: http://www.cs.nyu.edu/~michaels/blog/?p=24
# Author: Michael Schidlowsky

def gen
  (x=rand)>0.5 ? x : (x < rand/2.0) ? 1.0 - x : x
end

def gen2
   (x = rand) && rand ? 1.0 - x : x
end

def compute_distribution(numSamples, &block)
   samples = []
   values = 10
   numSamples.times{samples << yield}
   dist = Array.new(values, 0)
   samples.each{ |s| dist[(s*values).floor] += 1 }
   dist
end

p compute_distribution(1000){rand}
p compute_distribution(1000){gen}
p compute_distribution(1000) { gen2 }
puts


# Random number generation for a triangular distribution
# From: http://www.brighton-webs.co.uk/distributions/triangular.asp
# cf. http://en.wikipedia.org/wiki/Triangular_distribution

def rng(m, low, high)

   # cf. the parameter info at http://www.brighton-webs.co.uk/distributions/triangular.asp
   return nil unless high > low && m > low && m < high

   u = rand

   if u <= (m-low)/(high-low)
      r = low+ Math.sqrt(u*(high-low)*(m-low))
   else
      r = high - Math.sqrt((1.0-u)*(high-low)*(high-m))
   end

end

10.times do
  #puts rng(0.0, -25.0, 25.0)
  puts rng(50.0, 25.0, 75.0)
end
puts


# From: http://www.ruby-forum.com/topic/95931
# Author: Christoffer Lernö

class Range
  def rand
    return first if exclude_end? && last == first
    Kernel::rand(last - first + (exclude_end? ? 0 : 1)) + first
  end
end

r1 = -9..9
r2 = -90...100
p r1.rand, r2.rand

r3 = 0..9

num = []
10.times do
   num << r3.rand
   if num.first.zero? then num.shift; redo end
end

p num
puts num.to_s.to_i
puts


# See:
# http://redcorundum.blogspot.com/2008/01/randomizing-array-revisited.html
# http://redcorundum.blogspot.com/2006/12/randomizing-array-and-other-faqs.html
# http://szeryf.wordpress.com/2007/06/19/a-simple-shuffle-that-proved-not-so-simple-after-all/

class Array
  def shuffle
    array = dup
    size.downto 2 do |j|
      r = rand j
      array[j-1], array[r] = array[r], array[j-1]
    end
    array
  end
end

array = (1..50).to_a

10.times { p array.shuffle.first(10) }


#-------------------


class RNG

   def num(min=8,max=min+5,iter=1)

      return nil unless min.is_a?(Integer) && max.is_a?(Integer) && max > min && iter.is_a?(Integer)

      ret = []
      stats = Hash.new(0)     # optional; cf. stats[random_num] += 1
      digits = Array(0..9).sort_by {rand}
      #digits = (Array(0..9) * (rand(4)+1)).sort_by {rand}
      digits_size = digits.size

      iter.times do
         count = 0
         len = min + rand(max-min+1)
         ar = []
         while count < len
            i = rand(digits_size)    # get a random array index
            random_num = digits.at(i)
            stats[random_num] += 1
            ar << random_num
            digits = digits.sort_by {rand}
            count += 1
            if count == 1 && ar.first.zero? then ar.shift; stats[0] -= 1; count = 0 end
         end
         ret << ar.to_s.to_i
      end  # iter
      #ret
      ret << stats   # optional
   end

end

puts

min = 8
max = 13
iter = 10000
result =  RNG.new.num(min, max, iter)
stats = result.pop

t = 0
stats.each_value { |v| t += v }  # get the overall frequency

n = 0
t = t * 1.0
m = t / 10.0

stats.sort.each do |k,v|
   i = (v / t) * 100.0
   x = v > m ? v - m : m - v
   y = (x / m) * 100.0
   n += i
   puts "#{k}  ::  #{"%.2f" % m}  ::  #{v}  ::  #{"%.2f" % i} %  ::  #{ "%.2f" % ((m-v) * -1) }  ::  #{"%.2f" % y} %"
end

puts n, m, t

puts
puts RNG.new.num(20, 25, 10)[0..-2]

puts
rn = RNG.new.num(80, 100)
puts rn[0..-2]
p rn.last